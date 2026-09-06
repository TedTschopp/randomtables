const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
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
    const original = await page.evaluate(() => JSON.stringify(gen_data));
    await run(page);
    assert.deepEqual(errors, [], 'No browser runtime errors');
    assert.deepEqual(externalRequests, [], 'No HTTP requests, even with network access blocked');
    assert.equal(await page.evaluate(() => JSON.stringify(gen_data)), original, 'The original registry remains unchanged');
  } finally {
    await context.close();
  }
}

async function selectTable(page, id) {
  await page.locator('#table-search').fill(id);
  await page.locator(`.catalog-item[data-table-link="${id}"]`).click();
}

test('local-file startup renders a nonblank, framed neighborhood offline', async () => {
  await withPage(async page => {
    assert.match(await page.locator('#overview-stats').textContent(), /1,116 tables/);
    assert.equal(await page.locator('.graph-node').count(), 28);
    assert.equal(await page.locator('.graph-edge').count(), 32);
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
    await page.locator('#all-view').click();
    assert.equal(await page.locator('.graph-node').count(), 1152);
    assert.equal(await page.locator('.graph-edge').count(), 1137);
    await page.screenshot({ path: path.join(artifacts, 'desktop-all-tables.png') });
    await page.locator('#show-missing').uncheck();
    assert.equal(await page.locator('.graph-node').count(), 1116);
    await page.locator('#show-missing').check();
    await page.locator('.filters > summary').click();
    await page.locator('#source-filter').selectOption('tables/city.js');
    const filteredCount = await page.locator('.graph-node').count();
    assert.ok(filteredCount > 1 && filteredCount < 1152);
    await page.locator('#missing-filter').click();
    assert.equal(await page.locator('.graph-node[aria-label*="Unresolved reference"]').count(), 36);
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
    assert.equal(await page.locator('#bookmark-table').getAttribute('aria-pressed'), 'true');
    await page.locator('#bookmarks-only').click();
    assert.equal(await page.locator('.catalog-item').count(), 1);
    await page.locator('#bookmarks-only').click();
    await page.locator('#copy-token').click();
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), '{welcome_to_town}');
    const indexPromise = page.waitForEvent('download');
    await page.locator('#export-index').click();
    const indexDownload = await indexPromise;
    const index = JSON.parse(fs.readFileSync(await indexDownload.path(), 'utf8'));
    assert.equal(index.tables.length, 1116);
    assert.equal(index.relationships.length, 1137);
    assert.equal(index.unresolved.length, 36);
    const graphPromise = page.waitForEvent('download');
    await page.locator('#export-graph').click();
    const graphDownload = await graphPromise;
    const svg = fs.readFileSync(await graphDownload.path(), 'utf8');
    const exported = await page.evaluate(source => {
      const document = new DOMParser().parseFromString(source, 'image/svg+xml');
      return { errors: document.querySelectorAll('parsererror').length, nodes: document.querySelectorAll('.graph-node').length };
    }, svg);
    assert.deepEqual(exported, { errors: 0, nodes: 28 });
    await page.goto(`${pageUrl}#table=town_pride&view=focus&depth=1`);
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