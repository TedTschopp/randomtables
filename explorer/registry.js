(function (root) {
  'use strict';

  const sources = Object.create(null);
  const definitions = Object.create(null);
  const errors = [];
  root.AtlasRegistry = { sources, definitions, errors };
  root.gen_data = new Proxy(root.gen_data, {
    set(target, key, value) {
      const script = document.currentScript;
      const source = script ? (script.getAttribute('src') || '').replace(/^\.\.\//, '') : '';
      if (source.startsWith('tables/')) {
        sources[key] = source;
        if (!definitions[key]) definitions[key] = [];
        definitions[key].push(source);
      }
      return Reflect.set(target, key, value);
    }
  });
  root.addEventListener('error', event => {
    if (event.target && event.target.tagName === 'SCRIPT') {
      errors.push(`Could not load ${event.target.getAttribute('src')}.`);
    } else if (event.filename && event.filename.includes('/tables/')) {
      errors.push(`${event.filename.split('/').pop()}: ${event.message}`);
    }
  }, true);
})(globalThis);