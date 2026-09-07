const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL, fileURLToPath } = require('node:url');
const { before, after, test } = require('node:test');
const { chromium } = require('playwright');

const pageUrl = pathToFileURL(path.join(__dirname, '..', 'index.html')).href;
const artifacts = path.join(__dirname, '..', 'test-results');
let browser;

before(async () => {
  fs.mkdirSync(artifacts, { recursive: true });
  browser = await chromium.launch({ headless: true, channel: process.env.ATLAS_BROWSER_CHANNEL || undefined });
});

after(async () => { await browser?.close(); });

async function withPage(run) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await context.newPage();
  const errors = [];
  const externalRequests = [];
  page.on('pageerror', error => errors.push(error.message));
  await context.route(/^https?:\/\//, route => { externalRequests.push(route.request().url()); return route.abort(); });
  try {
    await page.goto(pageUrl);
    await page.locator('.graph-node').first().waitFor({ state: 'attached' });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('#load-error').isVisible(), false);
    const original = await registryFingerprint(page);
    await run(page);
    assert.deepEqual(errors, [], 'No browser runtime errors');
    assert.deepEqual(externalRequests, [], 'No HTTP requests, even with network access blocked');
    assert.equal(await registryFingerprint(page), original, 'The original registry remains unchanged');
  } finally {
    await context.close();
  }
}

async function selectTable(page, id) {
  await page.locator('#table-search').fill(id);
  await page.locator(`.catalog-item[data-table-link="${id}"]`).click();
}

async function registryFingerprint(page) {
  return page.evaluate(async () => {
    const bytes = new TextEncoder().encode(JSON.stringify(gen_data));
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
  });
}

test('classic generator, roll, and print pages load compatibility tables from local files', async () => {
  const context = await browser.newContext();
  const externalRequests = [];
  await context.route(/^https?:\/\//, route => { externalRequests.push(route.request().url()); return route.abort(); });
  try {
    for (const entryPoint of ['index.html', 'roll/index.html', 'print/index.html']) {
      const page = await context.newPage();
      const errors = [];
      const failedScripts = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('requestfailed', request => {
        if (request.resourceType() === 'script') failedScripts.push(request.url());
      });
      await page.goto(pathToFileURL(path.join(__dirname, '..', '..', entryPoint)).href);
      const imported = await page.evaluate(() => ({
        count: WikiImport.metadata.size,
        results: Object.keys(WikiImport.aliases).map(id => ({ id, text: generate_text(id) }))
      }));
      assert.equal(imported.count, 11, `${entryPoint} loads only the compatibility tables`);
      assert.equal(imported.results.length, 5);
      for (const result of imported.results) {
        assert.ok(result.text.trim(), `${entryPoint}: ${result.id} generates text`);
        assert.doesNotMatch(result.text, /\{\w+\}|Wiki table unavailable/);
        await page.locator('#input').fill(`{${result.id}}`);
        if (await page.locator('#number').count()) await page.locator('#number').fill('1');
        await page.locator('input[value="Generate"]').click();
        assert.ok((await page.locator('#output').textContent()).trim(), `${entryPoint}: Generate produces output`);
      }
      assert.deepEqual(errors, [], `${entryPoint} has no runtime errors`);
      assert.deepEqual(failedScripts, [], `${entryPoint} resolves all script paths from disk`);
      await page.close();
    }
    assert.deepEqual(externalRequests, [], 'Classic pages do not need HTTP');
  } finally {
    await context.close();
  }
});

test('wiki catalog exposes provenance and disables quarantined generators offline', async () => {
  await withPage(async page => {
    const summary = await page.evaluate(() => globalThis.WikiImport?.summary);
    assert.ok(summary?.tables > 20000, 'The full wiki collection is loaded');
    const ids = await page.evaluate(() => ({
      ready: WikiImport.aliases.Cheeseadj,
      blocked: [...WikiImport.metadata.values()].find(table => table.name === 'Ship Names.main').id,
      catalogOnly: [...WikiImport.metadata.values()].find(table => table.status === 'ready' && !table.legacyAvailable).id
    }));
    await selectTable(page, ids.ready);
    assert.equal(await page.locator('#table-title').textContent(), 'Cheeses.Cheeseadj');
    assert.match(await page.locator('#definition-note').textContent(), /ToB/);
    assert.match(await page.locator('#definition-note').textContent(), /Zak S/);
    assert.equal(new URL(await page.locator('.header-nav a').getAttribute('href'), page.url()).searchParams.get('table'), ids.ready);
    const sourceUrl = await page.locator('#table-source').evaluate(link => link.href);
    assert.equal(new URL(sourceUrl).protocol, 'file:');
    const archive = JSON.parse(fs.readFileSync(fileURLToPath(sourceUrl), 'utf8'));
    assert.ok(archive.tables.some(snapshot => snapshot.current.table.subtable.qualified_name === 'Cheeses.Cheeseadj'));
    assert.equal(await page.locator('#roll-button').isDisabled(), false);
    await page.locator('#roll-button').click();
    assert.ok((await page.locator('.roll-result').first().textContent()).trim());
    await selectTable(page, ids.catalogOnly);
    assert.equal(new URL(await page.locator('.header-nav a').getAttribute('href'), page.url()).searchParams.has('table'), false);
    await selectTable(page, ids.blocked);
    assert.equal(await page.locator('#table-kind').textContent(), 'Blocked');
    assert.equal(await page.locator('#wiki-validation').isVisible(), true);
    assert.equal(await page.locator('#roll-button').isDisabled(), true);
    const previousResults = await page.locator('#roll-results').textContent();
    await page.locator('#roll-button').dispatchEvent('click');
    assert.equal(await page.locator('#roll-output').isVisible(), false);
    assert.equal(await page.locator('#roll-results').textContent(), previousResults);
    assert.equal(await page.locator('.entry-row').count(), 4);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.screenshot({ path: path.join(artifacts, 'mobile-wiki-blocked.png'), fullPage: true });
  });
});

test('zero-weight rows stay visible at zero probability without entering generated results', async () => {
  await withPage(async page => {
    const identifier = await page.evaluate(() => [...WikiImport.metadata.values()].find(table => table.name === 'Real World Deities.\uD83D\uDC78').id);
    await selectTable(page, identifier);
    assert.equal(await page.locator('#roll-button').isDisabled(), false);
    assert.equal(await page.locator('#wiki-validation').isVisible(), false);
    const rows = await page.locator('.entry-row').evaluateAll(entries => entries.map(entry => ({
      text: entry.querySelector('.entry-text').textContent,
      probability: entry.querySelector('.entry-probability').textContent
    })));
    assert.equal(rows.length, 3);
    assert.equal(rows.filter(row => row.probability === '0%').length, 2);
    assert.ok(rows.some(row => row.text === '{{fc||#FFC|goddess}}' && row.probability === '0%'));
    assert.equal(await page.locator('.entry-row img, .entry-row script, .entry-row iframe').count(), 0);
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    }
    await page.screenshot({ path: path.join(artifacts, 'mobile-zero-weight.png'), fullPage: true });
    await page.locator('#roll-count').fill('10');
    await page.locator('#roll-button').click();
    const results = await page.locator('.roll-result').allTextContents();
    assert.equal(results.length, 10);
    for (const result of results) {
      assert.ok(result.trim());
      assert.doesNotMatch(result, /\{\{|#FFC|Wiki table unavailable/);
    }
    assert.equal(await page.locator('.roll-warning').count(), 0);
  });
});

test('ucfirst tables roll capitalized choices offline and retain their source relationships', async () => {
  await withPage(async page => {
    const ids = await page.evaluate(() => Object.fromEntries(
      [...WikiImport.metadata.values()].filter(table => ['Color.huesCap', 'Color.hues', 'Compass direction.4'].includes(table.name))
        .map(table => [table.name, table.id])
    ));
    async function rollAt(sample) {
      await page.locator('#roll-count').fill('1');
      await page.evaluate(value => {
        const originalRandom = Math.random;
        try {
          Math.random = () => value;
          document.getElementById('roll-button').click();
        } finally {
          Math.random = originalRandom;
        }
      }, sample);
      assert.equal(await page.locator('.roll-warning').count(), 0);
      return page.locator('.roll-result').first().textContent();
    }
    await selectTable(page, ids['Color.huesCap']);
    assert.equal(await page.locator('#roll-button').isDisabled(), false);
    assert.equal(await page.locator('#wiki-validation').isVisible(), false);
    assert.equal(await page.locator('.entry-row').count(), 1);
    assert.match(await page.locator('.entry-text').textContent(), /\{\{ucfirst:.*Color\.hues/);
    assert.equal((await rollAt(0)).trim(), 'Reddish');
    await page.screenshot({ path: path.join(artifacts, 'desktop-ucfirst.png') });
    await page.locator('#connections-tab').click();
    await page.locator(`.connection-link[data-table-link="${ids['Color.hues']}"]`).click();
    assert.equal(await page.locator('#table-title').textContent(), 'Color.hues');
    assert.equal((await rollAt(0)).trim(), 'reddish');
    await selectTable(page, ids['Compass direction.4']);
    assert.equal(await page.locator('#roll-button').isDisabled(), false);
    await page.locator('#entries-tab').click();
    assert.equal(await page.locator('.entry-row').count(), 2);
    assert.equal((await rollAt(0.625)).trim(), 'East');
    assert.equal((await rollAt(0.875)).trim(), 'West');
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    }
    await page.screenshot({ path: path.join(artifacts, 'mobile-ucfirst.png'), fullPage: true });
  });
});

test('static possessive tables retain their compiled choices offline', async () => {
  await withPage(async page => {
    const targets = await page.evaluate(() => {
      const byName = new Map([...WikiImport.metadata.values()].map(table => [table.name, table]));
      const artifact = byName.get('Artifacts.WaterBegin');
      const religious = byName.get('Fantasy Town Feature.religiousplace');
      function choice(table, prefix) {
        const values = gen_data[table.id];
        const [key, text] = Object.entries(values).find(([, value]) => value.startsWith(prefix) && value.includes('\u2019')) || [];
        return { id: table.id, text, sample: key ? (key_range(key)[0] - 0.5) / scale_table(values) : null };
      }
      return {
        artifact: choice(artifact, 'Admiral '), religious: choice(religious, 'St. '),
        source: byName.get('ScottishMale.ScottishMaleFirstName').id,
        blocked: byName.get('Ship Names.main').id
      };
    });
    async function rollChoice(target) {
      assert.notEqual(target.sample, null);
      await page.locator('#roll-count').fill('1');
      await page.evaluate(sample => {
        const originalRandom = Math.random;
        let first = true;
        try {
          Math.random = () => {
            if (!first) return 0.5;
            first = false;
            return sample;
          };
          document.getElementById('roll-button').click();
        } finally {
          Math.random = originalRandom;
        }
      }, target.sample);
      assert.equal(await page.locator('.roll-warning').count(), 0);
      return (await page.locator('.roll-result').first().textContent()).trim();
    }
    await selectTable(page, targets.artifact.id);
    assert.equal(await page.locator('#roll-button').isDisabled(), false);
    assert.equal(await page.locator('#wiki-validation').isVisible(), false);
    assert.equal(await page.locator('.entry-row').count(), 36);
    assert.match(await page.locator('#entries-panel').textContent(), /\{\{po\|/);
    assert.equal(await rollChoice(targets.artifact), targets.artifact.text);
    await page.screenshot({ path: path.join(artifacts, 'desktop-possessive.png') });
    await page.locator('#connections-tab').click();
    await page.locator(`.connection-link[data-table-link="${targets.source}"]`).click();
    assert.equal(await page.locator('#table-title').textContent(), 'ScottishMale.ScottishMaleFirstName');
    const sourceValues = await page.evaluate(identifier => Object.values(gen_data[identifier]), targets.source);
    assert.ok(sourceValues.every(value => !value.includes('\u2019')));
    await selectTable(page, targets.religious.id);
    assert.equal(await page.locator('#roll-button').isDisabled(), false);
    await page.locator('#entries-tab').click();
    assert.equal(await page.locator('.entry-row').count(), 3);
    assert.match(await rollChoice(targets.religious), /^St\. .+\u2019s? /);
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    }
    await page.screenshot({ path: path.join(artifacts, 'mobile-possessive.png'), fullPage: true });
    await page.setViewportSize({ width: 1440, height: 960 });
    await selectTable(page, targets.blocked);
    assert.equal(await page.locator('#roll-button').isDisabled(), true);
    assert.match(await page.locator('#wiki-validation').textContent(), /Secret Society Title/);
  });
});

test('compact wiki expressions roll offline with source weights, argument traces, and mobile layout', async () => {
  await withPage(async page => {
    const targets = await page.evaluate(() => {
      const byName = new Map([...WikiImport.metadata.values()].map(table => [table.name, table]));
      return ['Fantasy Town Names.main', 'Pathfinder Artifact.BeginName'].map(name => {
        const table = byName.get(name);
        return { id: table.id, name, status: table.status, execution: table.execution, entries: table.entries.length };
      });
    });
    for (const target of targets) {
      assert.equal(target.status, 'ready', target.name);
      assert.equal(target.execution, 'wiki', target.name);
      await page.setViewportSize({ width: 1440, height: 960 });
      await selectTable(page, target.id);
      assert.equal(await page.locator('#roll-button').isDisabled(), false);
      assert.equal(await page.locator('#wiki-validation').isVisible(), false);
      assert.equal(await page.locator('.entry-row').count(), target.entries);
      assert.equal(new URL(await page.locator('.header-nav a').getAttribute('href'), page.url()).searchParams.has('table'), false);
      await page.locator('#roll-count').fill('1');
      const expected = await page.evaluate(identifier => {
        const table = WikiImport.metadata.get(identifier);
        const entryIndex = table.program.findIndex(parts => parts?.some(part => part.op === 'po' && part.parts.some(argument => argument.ref)));
        const expression = table.program[entryIndex].find(part => part.op === 'po');
        const reference = expression.parts.find(part => part.ref).ref;
        const sourceWeight = table.entries.slice(0, entryIndex).reduce((total, entry) => total + entry.weight, 0);
        const sample = (sourceWeight + table.entries[entryIndex].weight / 2) / table.totalWeight;
        const originalRandom = Math.random;
        try {
          Math.random = () => 0.5;
          const argument = expression.parts.map(part => typeof part === 'string' ? part : generate_text(part.ref)).join('');
          let first = true;
          Math.random = () => {
            if (!first) return 0.5;
            first = false;
            return sample;
          };
          document.getElementById('roll-button').click();
          return { text: argument + (/[sS]$/.test(argument) ? '\u2019' : '\u2019s'), reference, name: WikiImport.metadata.get(reference).name };
        } finally {
          Math.random = originalRandom;
        }
      }, target.id);
      const text = await page.locator('.roll-result').first().textContent();
      assert.ok(text.includes(expected.text), target.name);
      assert.doesNotMatch(text, /[{}]|requires Table Atlas|unavailable/i);
      assert.equal(await page.locator('.roll-warning').count(), 0);
      if (!await page.locator('#roll-trace').evaluate(trace => trace.open)) await page.locator('#roll-trace summary').click();
      const argumentTrace = page.locator(`.trace-step[data-table-link="${expected.reference}"]`).first();
      assert.equal(await argumentTrace.isVisible(), true);
      if (target === targets[0]) await page.screenshot({ path: path.join(artifacts, 'desktop-wiki-expression.png') });
      for (const width of [320, 390]) {
        await page.setViewportSize({ width, height: 844 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      }
      if (target === targets[0]) await page.screenshot({ path: path.join(artifacts, 'mobile-wiki-expression.png'), fullPage: true });
      await argumentTrace.click();
      assert.equal(await page.locator('#table-title').textContent(), expected.name);
    }
  });
});

test('extended wiki macros roll offline with preserved source, nested evaluation, and responsive results', async () => {
  await withPage(async page => {
    assert.equal(await page.evaluate(() => WikiExpressions.evaluate(WikiExpressions.parse('{{ucfirst:{{ia|old book}}}} / {{#expr:2 + 3 * 4}} / {{#replace:aba|a|$&}}'))), 'An old book / 14 / $&b$&');
    const targets = await page.evaluate(() => {
      const byName = new Map([...WikiImport.metadata.values()].map(table => [table.name, table]));
      return ['1st Level Dungeon.details', '25 Magic Words Of American Television.main', 'Quick NPC.NPCDescriptor'].map(name => {
        const table = byName.get(name);
        const displayText = table.entries[0].text.replace(/\{(\w+)\}/g, (token, identifier) => `{${WikiImport.metadata.get(identifier)?.name || identifier}}`);
        return { id: table.id, name, rawText: table.entries[0].rawText, displayText, weight: table.entries[0].weight, total: table.totalWeight };
      });
    });
    for (const target of targets) {
      await page.setViewportSize({ width: 1440, height: 960 });
      await selectTable(page, target.id);
      assert.equal(await page.locator('#roll-button').isDisabled(), false, target.name);
      assert.equal(await page.locator('#wiki-validation').isVisible(), false, target.name);
      assert.equal(await page.locator('.entry-text').first().textContent(), target.displayText);
      const sourceUrl = await page.locator('#table-source').evaluate(link => link.href);
      const archive = JSON.parse(fs.readFileSync(fileURLToPath(sourceUrl), 'utf8'));
      const snapshot = archive.tables.find(snapshot => snapshot.current.table.subtable.qualified_name === target.name);
      assert.equal(snapshot.current.table.entries[0].text, target.rawText);
      await page.locator('#roll-count').fill('1');
      await page.evaluate(sample => {
        const originalRandom = Math.random;
        let first = true;
        try {
          Math.random = () => {
            if (!first) return 0.5;
            first = false;
            return sample;
          };
          document.getElementById('roll-button').click();
        } finally {
          Math.random = originalRandom;
        }
      }, target.weight / 2 / target.total);
      const output = await page.locator('.roll-result').first().textContent();
      assert.ok(output.trim(), target.name);
      assert.doesNotMatch(output, /\{\{|requires Table Atlas|unavailable/i);
      assert.equal(await page.locator('.roll-warning').count(), 0);
      assert.ok(await page.locator('.trace-step').count() > 1, target.name);
      if (target === targets[0]) await page.screenshot({ path: path.join(artifacts, 'desktop-extended-macros.png') });
      for (const width of [320, 390]) {
        await page.setViewportSize({ width, height: 844 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      }
      if (target === targets[0]) await page.screenshot({ path: path.join(artifacts, 'mobile-extended-macros.png'), fullPage: true });
    }
    assert.equal(await page.locator('.roll-result script, .roll-result iframe, .roll-result img').count(), 0);
  });
});

test('case-corrected tables preserve archived tokens and resolve offline rolls and traces on desktop and mobile', async () => {
  await withPage(async page => {
    const targets = await page.evaluate(() => {
      const tables = [...WikiImport.metadata.values()];
      const direct = tables.find(table => table.name === 'Fantasy Names.StartFemNoTitle');
      const dependent = tables.find(table => table.status === 'ready' && table.execution === 'wiki' &&
        table.dependencies.some(id => WikiImport.metadata.get(id)?.referenceCorrections?.length));
      const followUp = tables.find(table => table.name === 'Wild West Personas.colors');
      const recoveredRuntime = tables.find(table => table.name === 'Fantasy Landmarks.inspiration');
      return [direct, dependent, followUp, recoveredRuntime].map(table => {
        const correction = table.referenceCorrections?.[0];
        const row = correction ? correction.row - 1 : table.entries.findIndex(entry => entry.weight > 0 &&
          entry.references.some(id => WikiImport.metadata.get(id)?.referenceCorrections?.length));
        const entry = table.entries[row];
        let dependencySample;
        let dependencyTargetId;
        if (table === recoveredRuntime) {
          const noun = tables.find(candidate => candidate.name === 'Secret Society Title.Noun');
          const nested = noun.referenceCorrections[0];
          const range = Object.entries(gen_data[noun.id]).find(([, value]) => value.includes(`{${nested.targetId}}`))[0];
          const [start] = key_range(range);
          dependencySample = (start - 0.5) / scale_table(gen_data[noun.id]);
          dependencyTargetId = nested.targetId;
        }
        return { id: table.id, name: table.name, status: table.status, execution: table.execution, row,
          rawText: entry.rawText, sourceHash: table.sourceHash, correction, dependencySample, dependencyTargetId,
          displayText: entry.text.replace(/\{(\w+)\}/g, (token, id) => `{${WikiImport.metadata.get(id)?.name || id}}`),
          sample: (table.entries.slice(0, row).reduce((sum, item) => sum + item.weight, 0) + entry.weight / 2) / table.totalWeight };
      });
    });
    assert.equal(targets[1].execution, 'wiki');
    assert.equal(targets[3].execution, 'wiki');
    for (const target of targets) {
      await page.setViewportSize({ width: 1440, height: 960 });
      await selectTable(page, target.id);
      assert.equal(target.status, 'ready');
      assert.equal(await page.locator('#roll-button').isDisabled(), false);
      assert.equal(await page.locator('#wiki-validation').isVisible(), false);
      if (target.correction) {
        assert.equal(await page.locator('.entry-text').nth(target.row).textContent(), target.displayText);
        assert.ok(target.rawText.includes(target.correction.raw));
        assert.ok(target.displayText.includes(target.correction.to));
      }
      const sourceUrl = await page.locator('#table-source').evaluate(link => link.href);
      const archive = JSON.parse(fs.readFileSync(fileURLToPath(sourceUrl), 'utf8'));
      const source = archive.tables.find(record => record.current.table.subtable.qualified_name === target.name).current;
      assert.equal(source.sourceHash, target.sourceHash);
      assert.equal(source.table.entries[target.row].text, target.rawText);
      await page.locator('#roll-count').fill('1');
      await page.evaluate(samples => {
        const originalRandom = Math.random;
        try {
          Math.random = () => samples.length ? samples.shift() : 0.5;
          document.getElementById('roll-button').click();
        } finally {
          Math.random = originalRandom;
        }
      }, [target.sample, ...(target.dependencySample === undefined ? [] : [target.dependencySample])]);
      const output = await page.locator('.roll-result').first().textContent();
      assert.ok(output.trim(), target.name);
      assert.doesNotMatch(output, /\{\{|unavailable|requires Table Atlas/i);
      assert.equal(await page.locator('.roll-warning').count(), 0);
      if (!await page.locator('#roll-trace').evaluate(trace => trace.open)) await page.locator('#roll-trace summary').click();
      assert.ok(await page.locator('.trace-step').count() > 1);
      if (target.correction) assert.equal(await page.locator(`.trace-step[data-table-link="${target.correction.targetId}"]`).first().isVisible(), true);
      if (target.dependencyTargetId) assert.equal(await page.locator(`.trace-step[data-table-link="${target.dependencyTargetId}"]`).first().isVisible(), true);
      if (target === targets[0]) await page.screenshot({ path: path.join(artifacts, 'desktop-case-corrections.png') });
      if (target === targets[2]) await page.screenshot({ path: path.join(artifacts, 'desktop-follow-up-corrections.png') });
      for (const width of [320, 390]) {
        await page.setViewportSize({ width, height: 844 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      }
      if (target === targets[0]) await page.screenshot({ path: path.join(artifacts, 'mobile-case-corrections.png'), fullPage: true });
      if (target === targets[2]) await page.screenshot({ path: path.join(artifacts, 'mobile-follow-up-corrections.png'), fullPage: true });
    }
  });
});

test('source-recovered tables preserve archived evidence, probabilities, and whitespace offline', async () => {
  await withPage(async page => {
    const targets = await page.evaluate(() => {
      const byName = new Map([...WikiImport.metadata.values()].map(table => [table.name, table]));
      return ['ODnD Wilderness Encounter Cruncher.lair35', 'The Blues Engine.interjection', 'The Blues Engine.ain'].map(name => {
        const table = byName.get(name);
        return { id: table.id, name, status: table.status, execution: table.execution, sourceHash: table.sourceHash,
          correction: table.sourceCorrections?.[0], entries: table.entries.map(entry => ({ rawText: entry.rawText, rawSourceLine: entry.rawSourceLine })),
          dependency: table.dependencies[0] };
      });
    });
    assert.equal(targets[2].execution, 'wiki');
    for (const [index, target] of targets.entries()) {
      await page.setViewportSize({ width: 1440, height: 960 });
      await selectTable(page, target.id);
      assert.equal(target.status, 'ready');
      assert.equal(await page.locator('#roll-button').isDisabled(), false);
      assert.equal(await page.locator('#wiki-validation').isVisible(), false);
      const sourceUrl = await page.locator('#table-source').evaluate(link => link.href);
      const archive = JSON.parse(fs.readFileSync(fileURLToPath(sourceUrl), 'utf8'));
      const snapshot = archive.tables.find(record => record.current.table.subtable.qualified_name === target.name).current;
      assert.equal(snapshot.sourceHash, target.sourceHash);
      if (index === 0) {
        assert.equal(snapshot.table.entries.length, 0);
        assert.equal(snapshot.table.warnings.length, 2);
        assert.deepEqual(await page.locator('.entry-text').allTextContents(), ['(in lair)', '(not in lair)']);
        assert.deepEqual(await page.locator('.entry-probability').allTextContents(), ['35%', '65%']);
        for (const entry of target.entries) assert.equal(entry.rawText, snapshot.table.raw_source.split('\n')[entry.rawSourceLine - 1]);
      } else if (index === 1) {
        assert.equal(target.entries[0].rawText, '[ij],');
        assert.equal(snapshot.table.entries[0].raw_text, target.correction.raw);
        assert.ok(snapshot.table.warnings.includes(target.correction.warning));
        assert.equal(await page.locator('.entry-text').first().textContent(), '{The Blues Engine.ij}, ');
        const runtimeText = await page.evaluate(identifier => {
          const originalRandom = Math.random;
          try {
            Math.random = () => 0;
            return TableAtlas.roll(identifier, globalThis).text;
          } finally {
            Math.random = originalRandom;
          }
        }, target.id);
        assert.equal(runtimeText, 'I said, ');
      }
      await page.locator('#roll-count').fill('1');
      const cases = index === 0 ? [[0.1, '(in lair)'], [0.75, '(not in lair)']] : [[0.5, index === 1 ? 'I said, ' : null]];
      for (const [sample, expected] of cases) {
        await page.evaluate(sample => {
          const originalRandom = Math.random;
          let first = true;
          try {
            Math.random = () => { if (first) { first = false; return sample; } return 0; };
            document.getElementById('roll-button').click();
          } finally {
            Math.random = originalRandom;
          }
        }, sample);
        const output = await page.locator('.roll-result').first().textContent();
        if (expected !== null) assert.equal(output, expected.trim());
        else assert.ok(output.trim());
        if (index === 2) assert.ok(output.includes('I said, '), 'Recovered whitespace separates the composed phrase');
        assert.doesNotMatch(output, /\{\{|unavailable|requires Table Atlas/i);
        assert.equal(await page.locator('.roll-warning').count(), 0);
      }
      if (!await page.locator('#roll-trace').evaluate(trace => trace.open)) await page.locator('#roll-trace summary').click();
      assert.ok(await page.locator('.trace-step').count() >= (index === 0 ? 1 : 2));
      if (index === 1) assert.equal(await page.locator(`.trace-step[data-table-link="${target.dependency}"]`).first().isVisible(), true);
      if (index === 2) assert.equal(await page.locator(`.trace-step[data-table-link="${targets[1].id}"]`).first().isVisible(), true);
      if (index === 0) await page.screenshot({ path: path.join(artifacts, 'desktop-source-recovery.png') });
      for (const width of [320, 390]) {
        await page.setViewportSize({ width, height: 844 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      }
      if (index === 0) await page.screenshot({ path: path.join(artifacts, 'mobile-source-recovery.png'), fullPage: true });
      if (index === 2) await page.screenshot({ path: path.join(artifacts, 'mobile-source-recovery-macros.png'), fullPage: true });
    }
  });
});

test('wiki author, source, and validation filters retain the complete catalog', async () => {
  await withPage(async page => {
    const expected = await page.evaluate(() => {
      const model = TableAtlas.buildModel(gen_data, AtlasRegistry.sources);
      const source = model.byId.get(WikiImport.aliases.Cheeseadj).source;
      return {
        source,
        authorMatches: model.tables.filter(table => table.source === source && table.searchText.includes('zak s')).length,
        ready: model.tables.filter(table => !table.blocked && table.entries.length).length,
        blocked: WikiImport.summary.blocked
      };
    });
    await page.locator('.filters > summary').click();
    await page.locator('#source-filter').selectOption(expected.source);
    assert.equal(await page.locator('#source-filter option:checked').textContent(), 'Wiki: Cheeses');
    await page.locator('#table-search').fill('Zak S');
    assert.ok(expected.authorMatches > 0);
    assert.equal(await page.locator('#catalog-count').textContent(), `${expected.authorMatches.toLocaleString()} table${expected.authorMatches === 1 ? '' : 's'}`);
    await page.locator('#table-search').fill('');
    await page.locator('#source-filter').selectOption('all');
    await page.locator('#relation-filter').selectOption('blocked');
    assert.equal(await page.locator('#catalog-count').textContent(), `${expected.blocked.toLocaleString()} tables`);
    const selected = await page.locator('#table-token').textContent();
    await page.locator('#random-table').click();
    assert.equal(await page.locator('#table-token').textContent(), selected, 'Blocked-only filters have no random-roll candidate');
    await page.locator('#relation-filter').selectOption('ready');
    assert.equal(await page.locator('#catalog-count').textContent(), `${expected.ready.toLocaleString()} tables`);
  });
});

test('local-file startup renders a nonblank, framed neighborhood offline', async () => {
  await withPage(async page => {
    const expected = await page.evaluate(() => {
      const model = TableAtlas.buildModel(gen_data, AtlasRegistry.sources);
      const selected = new URLSearchParams(location.hash.slice(1)).get('table');
      const graph = TableAtlas.graphWindow(TableAtlas.neighborhood(model, selected, Number(document.getElementById('graph-depth').value)), selected);
      return { tables: model.tables.length.toLocaleString(), nodes: graph.nodes.length, edges: graph.edges.length };
    });
    assert.ok((await page.locator('#overview-stats').textContent()).includes(`${expected.tables} tables`));
    assert.equal(await page.locator('.graph-node').count(), expected.nodes);
    assert.equal(await page.locator('.graph-edge').count(), expected.edges);
    const geometry = await page.evaluate(() => {
      const stage = document.getElementById('graph-stage').getBoundingClientRect();
      const nodes = [...document.querySelectorAll('.node-body')].map(node => node.getBoundingClientRect());
      return {
        invalid: [...document.querySelectorAll('.graph-edge')].some(edge => /NaN|Infinity/.test(edge.getAttribute('d'))),
        framed: nodes.every(node => node.width > 0 && node.x >= stage.x && node.right <= stage.right && node.y >= stage.y && node.bottom <= stage.bottom),
        coloredArea: nodes.reduce((total, node) => total + node.width * node.height, 0)
      };
    });
    assert.equal(geometry.invalid, false);
    assert.equal(geometry.framed, true);
    assert.ok(geometry.coloredArea > 500);
    await page.screenshot({ path: path.join(artifacts, 'desktop-focus.png') });
  });
});

test('catalog, entry pagination, references, and inspector scroll work together', async () => {
  await withPage(async page => {
    await selectTable(page, 'town_pride');
    assert.equal(await page.locator('#catalog-count').textContent(), '1 table');
    assert.equal(await page.locator('#stat-entries').textContent(), '54');
    assert.equal(await page.locator('.entry-row').count(), 40);
    await page.locator('#more-entries').click();
    assert.equal(await page.locator('.entry-row').count(), 54);
    await page.locator('#entry-search').fill('museum');
    assert.equal(await page.locator('.entry-row').count(), 1);
    await page.locator('#entry-search').fill('');
    await page.locator('#connections-tab').click();
    assert.equal(await page.locator('.connection-link').count(), 14);
    await page.locator('.connection-link[data-table-link="welcome_to_town"]').click();
    assert.equal(await page.locator('#table-token').textContent(), '{welcome_to_town}');
    await page.locator('.graph-node[data-table="town_pride"] .node-body').click();
    assert.equal(await page.locator('#table-token').textContent(), '{town_pride}');
    await page.locator('#entries-tab').click();
    await page.evaluate(() => { document.querySelector('.inspector-content').scrollTop = 300; });
    await selectTable(page, 'bread');
    assert.equal(await page.locator('.inspector-content').evaluate(node => node.scrollTop), 0);
  });
});

test('the whole atlas, source filters, missing targets, and zoom work', async () => {
  await withPage(async page => {
    const expected = await page.evaluate(() => {
      const model = TableAtlas.buildModel(gen_data, AtlasRegistry.sources);
      const selected = new URLSearchParams(location.hash.slice(1)).get('table');
      const full = TableAtlas.graphWindow(model, selected);
      return {
        tables: model.tables.length, nodes: full.nodes.length, edges: full.edges.length,
        totalNodes: full.totalNodes, totalEdges: full.totalEdges,
        unresolved: model.nodes.filter(table => table.missing || table.outgoing.some(id => model.byId.get(id).missing)).length
      };
    });
    await page.locator('#all-view').click();
    assert.equal(await page.locator('.graph-node').count(), expected.nodes);
    assert.equal(await page.locator('.graph-edge').count(), expected.edges);
    assert.ok(expected.nodes <= 600 && expected.edges <= 3000);
    assert.equal(await page.locator('#graph-count').textContent(), `${expected.nodes.toLocaleString()} of ${expected.totalNodes.toLocaleString()} nodes / ${expected.edges.toLocaleString()} of ${expected.totalEdges.toLocaleString()} links`);
    await page.screenshot({ path: path.join(artifacts, 'desktop-all-tables.png') });
    await page.locator('#show-missing').uncheck();
    assert.equal(await page.locator('.graph-node').count(), Math.min(600, expected.tables));
    assert.equal(await page.locator('.graph-node[aria-label*="Unresolved reference"]').count(), 0);
    await page.locator('#show-missing').check();
    await page.locator('.filters > summary').click();
    await page.locator('#source-filter').selectOption('tables/city.js');
    const filteredCount = await page.locator('.graph-node').count();
    assert.ok(filteredCount > 1 && filteredCount < expected.nodes);
    await page.locator('#missing-filter').click();
    const visibleMissing = await page.locator('.graph-node[aria-label*="Unresolved reference"]').count();
    assert.ok(visibleMissing > 0 && visibleMissing <= 600);
    assert.equal(await page.locator('#catalog-count').textContent(), `${expected.unresolved.toLocaleString()} results`);
    assert.equal(await page.locator('#roll-button').isDisabled(), true);
    assert.equal(await page.locator('#connections-panel').isVisible(), true);
    const beforeZoom = await page.locator('.graph-content').getAttribute('transform');
    await page.locator('#zoom-in').click();
    await page.waitForFunction(previous => document.querySelector('.graph-content').getAttribute('transform') !== previous, beforeZoom);
    await page.locator('#fit-graph').click();
    assert.equal(await page.locator('.graph-edge').evaluateAll(edges => edges.some(edge => /NaN|Infinity/.test(edge.getAttribute('d')))), false);
  });
});

test('rolls trace the legacy engine, clamp batches, and guard unsafe or recursive output', async () => {
  await withPage(async page => {
    await selectTable(page, 'dinner');
    await page.locator('#roll-count').fill('3');
    await page.locator('#roll-button').click();
    assert.equal(await page.locator('.roll-result').count(), 3);
    assert.ok(await page.locator('.trace-step').count() > 3);
    await page.locator('#roll-count').fill('500');
    await page.locator('#roll-button').click();
    assert.equal(await page.locator('.roll-result').count(), 10);
    const guards = await page.evaluate(() => {
      const original = gen_data.dinner;
      document.getElementById('roll-count').value = '1';
      try {
        gen_data.dinner = ['<img src="https://example.invalid/atlas-test" onerror="globalThis.atlasUnsafeOutput = true"><b>Safe</b><br>{absent}'];
        document.getElementById('roll-button').click();
        const safeText = document.querySelector('.roll-result').textContent;
        const unsafeElements = document.querySelectorAll('#roll-results img, #roll-results script, #roll-results b').length;
        gen_data.dinner = ['{dinner}'];
        document.getElementById('roll-button').click();
        return { safeText, unsafeElements, unsafeExecuted: globalThis.atlasUnsafeOutput === true, boundedSteps: document.querySelectorAll('.trace-step').length, warning: document.querySelector('.roll-warning').textContent };
      } finally {
        gen_data.dinner = original;
      }
    });
    assert.match(guards.safeText, /Safe\n\[Missing: absent\]/);
    assert.equal(guards.unsafeElements, 0);
    assert.equal(guards.unsafeExecuted, false);
    assert.ok(guards.boundedSteps <= 64);
    assert.match(guards.warning, /Expansion limit/);
  });
});

test('bookmarks persist, deep links navigate, and clipboard and exports contain real data', async () => {
  await withPage(async page => {
    await page.locator('#bookmark-table').click();
    await page.reload();
    await page.locator('.graph-node').first().waitFor({ state: 'attached' });
    assert.equal(await page.locator('#bookmark-table').getAttribute('aria-pressed'), 'true');
    await page.locator('#bookmarks-only').click();
    assert.equal(await page.locator('.catalog-item').count(), 1);
    await page.locator('#bookmarks-only').click();
    await page.locator('#copy-token').click();
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), '{welcome_to_town}');
    const expected = await page.evaluate(() => {
      const model = TableAtlas.buildModel(gen_data, AtlasRegistry.sources);
      return { tables: model.tables.length, relationships: model.edges.length, unresolved: model.nodes.filter(table => table.missing).length };
    });
    const visibleNodes = await page.locator('.graph-node').count();
    const indexPromise = page.waitForEvent('download');
    await page.locator('#export-index').click();
    const indexDownload = await indexPromise;
    const index = JSON.parse(fs.readFileSync(await indexDownload.path(), 'utf8'));
    assert.equal(index.tables.length, expected.tables);
    assert.equal(index.relationships.length, expected.relationships);
    assert.equal(index.unresolved.length, expected.unresolved);
    assert.ok(index.tables.some(table => table.blocked && table.provenance.issues.length));
    assert.ok(index.tables.some(table => table.provenance?.name === 'Cheeses.Cheeseadj' && table.provenance.originalContributor.name === 'Zak S'));
    const graphPromise = page.waitForEvent('download');
    await page.locator('#export-graph').click();
    const graphDownload = await graphPromise;
    const svg = fs.readFileSync(await graphDownload.path(), 'utf8');
    const exported = await page.evaluate(source => {
      const document = new DOMParser().parseFromString(source, 'image/svg+xml');
      return { errors: document.querySelectorAll('parsererror').length, nodes: document.querySelectorAll('.graph-node').length };
    }, svg);
    assert.deepEqual(exported, { errors: 0, nodes: visibleNodes });
    await page.goto(`${pageUrl}#table=town_pride&view=focus&depth=1`);
    await page.locator('.graph-node').first().waitFor({ state: 'attached' });
    assert.equal(await page.locator('#graph-depth').inputValue(), '1');
    assert.equal(await page.locator('#table-token').textContent(), '{town_pride}');
    await page.locator('#connections-tab').click();
    await page.locator('.connection-link[data-table-link="dinner"]').click();
    await page.goBack();
    assert.equal(await page.locator('#table-token').textContent(), '{town_pride}');
  });
});

test('desktop, tablet, and mobile layouts fit, and the mobile catalog is keyboard accessible', async () => {
  await withPage(async page => {
    for (const [width, height] of [[1440, 960], [1100, 800], [1024, 768], [768, 1024], [390, 844], [320, 700]]) {
      await page.setViewportSize({ width, height });
      const layout = await page.evaluate(() => {
        const toolbar = document.querySelector('.map-toolbar').getBoundingClientRect();
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          toolbarClipped: [...document.querySelector('.map-toolbar').children].some(child => {
            const bounds = child.getBoundingClientRect();
            return bounds.width > 0 && (bounds.x < toolbar.x || bounds.right > toolbar.right);
          })
        };
      });
      assert.equal(layout.overflow, false, `No page overflow at ${width}px`);
      assert.equal(layout.toolbarClipped, false, `No clipped controls at ${width}px`);
      if (width <= 760) assert.equal(await page.locator('#catalog').isVisible(), false, 'A closed catalog must not cover the mobile layout');
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(artifacts, 'mobile-focus.png'), fullPage: true });
    await page.locator('#open-catalog').click();
    assert.equal(await page.locator('#catalog').getAttribute('aria-modal'), 'true');
    assert.equal(await page.locator('#table-search').evaluate(node => document.activeElement === node), true);
    await page.locator('#close-catalog').focus();
    await page.keyboard.press('Shift+Tab');
    assert.equal(await page.evaluate(() => document.getElementById('catalog').contains(document.activeElement)), true);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#open-catalog').getAttribute('aria-expanded'), 'false');
    await page.locator('#open-catalog').click();
    await selectTable(page, 'town_pride');
    assert.equal(await page.locator('#open-catalog').getAttribute('aria-expanded'), 'false');
    assert.equal(await page.locator('#table-token').textContent(), '{town_pride}');
    await page.locator('#connections-tab').focus();
    await page.keyboard.press('Home');
    assert.equal(await page.locator('#entries-tab').getAttribute('aria-selected'), 'true');
  });
});

test('default desktop and mobile views pass automated WCAG A and AA checks', async () => {
  await withPage(async page => {
    await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 960 });
      const results = await page.evaluate(async () => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } }));
      fs.writeFileSync(path.join(artifacts, `accessibility-${width}.json`), JSON.stringify(results, null, 2));
      assert.deepEqual(results.violations.map(violation => ({ rule: violation.id, impact: violation.impact, count: violation.nodes.length, examples: violation.nodes.slice(0, 3).map(node => ({ target: node.target, summary: node.failureSummary })) })), [], `Accessibility at ${width}px`);
    }
  });
});