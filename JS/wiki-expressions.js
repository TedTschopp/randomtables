(function (root, factory) {
  'use strict';
  const commonJS = typeof module === 'object' && module.exports;
  const api = factory(commonJS ? require('./wiki-template-data.js') : root.WikiTemplateData,
    commonJS ? require('../explorer/node_modules/jsep') : root.jsep);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else Object.defineProperty(root, 'WikiExpressions', { value: api });
})(globalThis, function (templateData, arithmeticParser) {
  'use strict';

  const supportedOperations = Object.freeze([
    'article', 'ucfirst', 'lcfirst', 'lc', 'uc', 'plural', 'po', 'pronoun', 'concat', 'comma',
    '#expr', '#replace', '#sub', '#pos', '#rpos', '#len', '#ifeq', '#if', '#ifexist', '#switch',
    'numtostring', 'array norepeat', 'array implode', 'psychon norepeat', 'link', 'hover',
    'linkme', 'font color', 'dieroll', 'currentyear', '!'
  ]);
  const aliases = Object.freeze({ ia: 'article', fc: 'font color', p: '!' });
  const allowed = new Set(supportedOperations);

  function operation(name) {
    const normalized = name.trim().replace(/^Template\s*:/i, '').replace(/_/g, ' ').toLowerCase();
    const canonical = Object.hasOwn(aliases, normalized) ? aliases[normalized] : normalized;
    if (!allowed.has(canonical)) throw new Error(`Unsupported wiki operation: ${name}`);
    return canonical;
  }

  function parse(input, { reference, parameters = false } = {}) {
    const text = String(input);
    if (text.length > 32768 || !text.isWellFormed()) throw new Error('Wiki expression source exceeds the size limit or contains invalid Unicode');
    let cursor = 0;
    let nodes = 0;
    function parts(depth, terminator) {
      if (depth > 32) throw new Error('Wiki expression depth limit exceeded');
      const result = [];
      let literal = '';
      function push(value) {
        nodes += 1;
        if (nodes > 65536 || result.length >= 4096) throw new Error('Wiki expression node limit exceeded');
        result.push(value);
      }
      function flush() {
        if (literal) push(literal);
        literal = '';
      }
      while (cursor < text.length) {
        if (terminator && (text.startsWith(terminator, cursor) || text[cursor] === '|')) break;
        if (text.startsWith('{{{', cursor)) {
          if (!parameters) throw new Error('Unsupported unbound wiki parameter');
          flush();
          cursor += 3;
          const start = cursor;
          while (cursor < text.length && !['|', '}'].includes(text[cursor])) cursor += 1;
          const name = text.slice(start, cursor).trim();
          if (!/^(?:[1-9]\d*|[A-Za-z][\w ]*)$/.test(name)) throw new Error('Unsupported wiki parameter name');
          const parameter = { parameter: name };
          if (text[cursor] === '|') {
            cursor += 1;
            parameter.fallback = parts(depth + 1, '}}}');
          }
          if (!text.startsWith('}}}', cursor)) throw new Error('Unclosed wiki parameter');
          cursor += 3;
          push(parameter);
        } else if (text.startsWith('{{', cursor)) {
          flush();
          cursor += 2;
          const start = cursor;
          while (cursor < text.length && !['|', ':', '}'].includes(text[cursor])) cursor += 1;
          if (text[cursor] === ':' && /^Template$/i.test(text.slice(start, cursor).trim())) {
            cursor += 1;
            while (cursor < text.length && !['|', ':', '}'].includes(text[cursor])) cursor += 1;
          }
          const op = operation(text.slice(start, cursor));
          const args = [];
          const named = Object.create(null);
          let position = 0;
          const magic = op.startsWith('#') || ['ucfirst', 'lcfirst', 'uc', 'lc'].includes(op);
          if (magic && text[cursor] !== ':') throw new Error(`Unsupported wiki operation delimiter: ${op}`);
          if (text[cursor] === ':' || text[cursor] === '|') {
            do {
              cursor += 1;
              let argument = parts(depth + 1, '}}');
              const assignment = !magic && typeof argument[0] === 'string' && /^\s*([A-Za-z]\w*|[1-9]\d*)\s*=/.exec(argument[0]);
              if (assignment) {
                argument = [argument[0].slice(assignment[0].length), ...argument.slice(1)];
                if (typeof argument[0] === 'string') argument[0] = argument[0].trimStart();
                if (typeof argument.at(-1) === 'string') argument[argument.length - 1] = argument.at(-1).trimEnd();
                if (/^\d+$/.test(assignment[1])) {
                  const index = Number(assignment[1]) - 1;
                  if (index >= 32) throw new Error('Wiki argument count limit exceeded');
                  while (args.length <= index) args.push(null);
                  args[index] = argument;
                } else named[assignment[1]] = argument;
              } else {
                args[position] = argument;
                position += 1;
              }
              if (args.length + Object.keys(named).length > 32) throw new Error('Wiki argument count limit exceeded');
            } while (text[cursor] === '|');
          }
          if (!text.startsWith('}}', cursor)) throw new Error(`Unclosed wiki operation: ${op}`);
          cursor += 2;
          const call = { op, args };
          if (Object.keys(named).length) call.named = { ...named };
          push(call);
        } else if (text[cursor] === '[') {
          flush();
          const end = text.indexOf(']', cursor + 1);
          const token = text.slice(cursor + 1, end);
          if (end < 0 || /[\[{}\r\n]/.test(token) || !reference) throw new Error('Unsupported or unclosed wiki reference');
          const ref = reference(token);
          if (!/^wiki_abulafia_\d+_[a-f0-9]*$/.test(ref)) throw new Error(`Unsupported wiki reference: ${token}`);
          push({ ref });
          cursor = end + 1;
        } else {
          if (/[{}\]]/.test(text[cursor])) throw new Error('Unsupported or unclosed wiki delimiter');
          literal += text[cursor];
          cursor += 1;
        }
      }
      flush();
      return result;
    }
    return parts(0);
  }

  const programs = new WeakSet();
  const templates = new Map();
  const argumentLimits = {
    article: [0, 1], plural: [0, 2], po: [0, 2], pronoun: [2, 2], concat: [2, 2], numtostring: [1, 1],
    'array norepeat': [0, 2], 'array implode': [0, 3], 'psychon norepeat': [0, 3],
    ucfirst: [1, 1], lcfirst: [1, 1], uc: [1, 1], lc: [1, 1],
    '#expr': [0, 1], '#len': [0, 1], '#sub': [1, 3], '#pos': [1, 3], '#rpos': [1, 2], '#replace': [1, 3],
    '#if': [1, 3], '#ifeq': [2, 4], '#ifexist': [1, 3], '#switch': [1, 32],
    link: [0, 2], hover: [2, 2], linkme: [1, 1], 'font color': [0, 3], dieroll: [0, 0],
    currentyear: [0, 0], comma: [0, 0], '!': [0, 0]
  };

  function fail(message, type = 'syntax') {
    throw Object.assign(new Error(message), { type });
  }

  function validate(input, { parameters = false } = {}) {
    let nodes = 0;
    function copy(parts, depth = 0) {
      if (!Array.isArray(parts) || parts.length > 4096 || depth > 32) fail('Invalid wiki expression size or depth limit');
      const result = Object.freeze(parts.map(part => {
        nodes += 1;
        if (nodes > 65536) fail('Wiki expression node limit exceeded', 'limit');
        if (typeof part === 'string') {
          if (part.length > 32768 || !part.isWellFormed() || /[{}]|<\/?[A-Za-z!]|[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(part)) fail('Invalid wiki expression literal');
          return part;
        }
        if (!part || typeof part !== 'object' || Array.isArray(part)) fail('Invalid wiki expression node');
        const keys = Object.keys(part);
        if (keys.length === 1 && typeof part.ref === 'string' && /^wiki_abulafia_\d+_[a-f0-9]*$/.test(part.ref)) return Object.freeze({ ref: part.ref });
        if (parameters && typeof part.parameter === 'string' && /^(?:[1-9]\d*|[A-Za-z][\w ]*)$/.test(part.parameter) &&
            keys.every(key => ['parameter', 'fallback'].includes(key))) {
          return Object.freeze({ parameter: part.parameter, ...(part.fallback ? { fallback: copy(part.fallback, depth + 1) } : {}) });
        }
        if (typeof part.op !== 'string' || !Array.isArray(part.args) || !keys.every(key => ['op', 'args', 'named'].includes(key))) fail('Unsupported wiki expression shape or parameter');
        const op = operation(part.op);
        const [minimum, maximum] = argumentLimits[op];
        if (part.args.length < minimum || part.args.length > maximum) fail(`Unsupported ${op} argument count`);
        const namedKeys = part.named ? Object.keys(part.named) : [];
        const allowedNames = op === 'dieroll' ? ['title', 'dice', 'text'] : op === 'hover' ? ['link', 'dotted'] : [];
        if (part.named && (typeof part.named !== 'object' || Array.isArray(part.named)) || namedKeys.some(key => !allowedNames.includes(key))) fail(`Unsupported ${op} named argument`);
        const call = { op, args: Object.freeze(Array.from(part.args, argument => argument === null ? null : copy(argument, depth + 1))) };
        if (namedKeys.length) call.named = Object.freeze(Object.fromEntries(namedKeys.map(key => [key, copy(part.named[key], depth + 1)])));
        return Object.freeze(call);
      }));
      programs.add(result);
      return result;
    }
    return copy(input);
  }

  const unaryMath = {
    '+': value => value, '-': value => -value, not: value => Number(!value),
    ceil: Math.ceil, floor: Math.floor, trunc: Math.trunc, abs: Math.abs, exp: Math.exp, ln: Math.log,
    sin: Math.sin, cos: Math.cos, tan: Math.tan, acos: Math.acos, asin: Math.asin, atan: Math.atan, sqrt: Math.sqrt
  };
  const binaryMath = {
    or: [1, (left, right) => Number(Boolean(left || right))], and: [2, (left, right) => Number(Boolean(left && right))],
    '=': [3, (left, right) => Number(left === right)], '!=': [3, (left, right) => Number(left !== right)],
    '<>': [3, (left, right) => Number(left !== right)], '<': [3, (left, right) => Number(left < right)],
    '>': [3, (left, right) => Number(left > right)], '<=': [3, (left, right) => Number(left <= right)],
    '>=': [3, (left, right) => Number(left >= right)],
    round: [4, (left, right) => {
      const scale = 10 ** Math.trunc(right);
      if (!Number.isFinite(scale) || !Number.isFinite(left * scale)) return left;
      if (!scale) return 0;
      return Math.sign(left) * Math.floor(Math.abs(left) * scale + 0.5) / scale;
    }],
    '+': [5, (left, right) => left + right], '-': [5, (left, right) => left - right],
    '*': [6, (left, right) => left * right], '/': [6, (left, right) => left / right],
    div: [6, (left, right) => left / right], mod: [6, (left, right) => Math.trunc(left) % Math.trunc(right)],
    fmod: [6, (left, right) => left % right], '^': [7, (left, right) => left ** right]
  };
  if (arithmeticParser) {
    arithmeticParser.removeAllBinaryOps();
    arithmeticParser.removeAllUnaryOps();
    for (const [operator, [precedence]] of Object.entries(binaryMath)) arithmeticParser.addBinaryOp(operator, precedence);
    for (const operator of Object.keys(unaryMath)) arithmeticParser.addUnaryOp(operator);
  }

  function arithmetic(input) {
    const text = input.trim().toLowerCase();
    if (!text) return '';
    if (!arithmeticParser || text.length > 4096) fail('Arithmetic expression parser unavailable or size limit exceeded');
    let ast;
    try { ast = arithmeticParser(text); } catch (error) { fail(`Invalid arithmetic expression: ${error.message}`); }
    let count = 0;
    function calculate(node, depth = 0) {
      count += 1;
      if (count > 2048 || depth > 64) fail('Arithmetic expression complexity limit exceeded', 'limit');
      let value;
      if (node.type === 'Literal' && typeof node.value === 'number') value = node.value;
      else if (node.type === 'Identifier' && ['pi', 'e'].includes(node.name)) value = node.name === 'pi' ? Math.PI : Math.E;
      else if (node.type === 'UnaryExpression' && Object.hasOwn(unaryMath, node.operator)) value = unaryMath[node.operator](calculate(node.argument, depth + 1));
      else if (node.type === 'BinaryExpression' && Object.hasOwn(binaryMath, node.operator)) value = binaryMath[node.operator][1](calculate(node.left, depth + 1), calculate(node.right, depth + 1));
      else fail('Unsupported arithmetic expression node');
      if (!Number.isFinite(value)) fail('Arithmetic expression must remain finite; division by zero is unsupported');
      return value;
    }
    const value = calculate(ast);
    return Object.is(value, -0) ? '-0' : String(Number(value.toPrecision(14)));
  }

  function equal(first, second) {
    if (/^[+-]?\d+$/.test(first) && /^[+-]?\d+$/.test(second)) return BigInt(first) === BigInt(second);
    const numeric = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;
    if (numeric.test(first) && numeric.test(second) && Number.isFinite(Number(first)) && Number.isFinite(Number(second))) return Number(first) === Number(second);
    return first === second;
  }

  function splitAssignment(parts) {
    for (const [index, part] of parts.entries()) {
      if (typeof part !== 'string' || !part.includes('=')) continue;
      const position = part.indexOf('=');
      return [[...parts.slice(0, index), part.slice(0, position)], [part.slice(position + 1), ...parts.slice(index + 1)]];
    }
    return null;
  }

  function evaluate(input, options = {}) {
    const program = programs.has(input) ? input : validate(input);
    const budget = options.budget || { operations: 0 };
    const now = new Date(options.now ?? Date.now());
    function limited(value) {
      if (typeof value !== 'string' || !value.isWellFormed()) fail('Invalid wiki expression result');
      if (value.length > 32768) fail('Wiki expression output limit exceeded', 'limit');
      return value;
    }
    function expand(parts, depth = 0, parameter) {
      if (depth > 64) fail('Wiki expression evaluation depth limit exceeded', 'limit');
      let text = '';
      for (const part of parts) {
        budget.operations += 1;
        if (budget.operations > 4096) fail('Wiki expression operation limit exceeded', 'limit');
        let value;
        if (typeof part === 'string') value = part;
        else if (part.ref) {
          if (!options.resolve) fail('Missing wiki reference resolver');
          value = options.resolve(part.ref);
        } else if (part.parameter) {
          value = parameter?.(part.parameter);
          if (value === undefined) value = part.fallback ? expand(part.fallback, depth + 1, parameter) : '';
        } else value = invoke(part, depth + 1, parameter);
        text = limited(text + limited(value));
      }
      return text;
    }
    function invoke(call, depth, parameter) {
      const cache = new Map();
      function argument(index, trim = true) {
        if (!cache.has(index)) cache.set(index, expand(call.args[index] || [], depth + 1, parameter));
        return trim ? cache.get(index).trim() : cache.get(index);
      }
      function named(name, fallback = '') {
        return call.named?.[name] ? expand(call.named[name], depth + 1, parameter).trim() : fallback;
      }
      if (templateData && Object.hasOwn(templateData, call.op)) {
        if (!templates.has(call.op)) templates.set(call.op, validate(parse(templateData[call.op].source, { parameters: true }), { parameters: true }));
        return expand(templates.get(call.op), depth + 1, name => {
          const index = Number(name) - 1;
          return Number.isInteger(index) && call.args[index] !== undefined && call.args[index] !== null ? argument(index, false) : undefined;
        });
      }
      if (call.op === '#if') return argument(argument(0) ? 1 : 2);
      if (call.op === '#ifeq') return argument(equal(argument(0), argument(1)) ? 2 : 3);
      if (call.op === '#ifexist') {
        if (!options.exists) fail('Wiki page-existence context is unavailable');
        return argument(options.exists(argument(0)) ? 1 : 2);
      }
      if (call.op === '#switch') {
        const subject = argument(0);
        let matched = false;
        let fallback = [];
        for (let index = 1; index < call.args.length; index += 1) {
          const pair = splitAssignment(call.args[index] || []);
          if (pair) {
            const key = expand(pair[0], depth + 1, parameter).trim();
            if (key === '#default') fallback = pair[1];
            else if (matched || equal(subject, key)) return expand(pair[1], depth + 1, parameter).trim();
            matched = false;
          } else if (index === call.args.length - 1) fallback = call.args[index] || [];
          else matched ||= equal(subject, argument(index));
        }
        return expand(fallback, depth + 1, parameter).trim();
      }
      if (call.op === 'comma') return ', ';
      if (call.op === '!') return '|';
      if (call.op === 'currentyear') {
        if (!Number.isFinite(now.getTime())) fail('Invalid wiki current-year clock');
        return String(now.getUTCFullYear());
      }
      if (call.op === 'dieroll') return named('text', named('dice', '1d1'));
      if (call.op === 'hover') return argument(1, false);
      if (call.op === 'linkme') return argument(0, false);
      if (call.op === 'link') return argument(1) || argument(0, false);
      if (call.op === 'font color') return argument(2) ? argument(2, false) : argument(1, false);
      const value = argument(0);
      if (call.op === 'uc') return value.toUpperCase();
      if (call.op === 'lc') return value.toLowerCase();
      if (call.op === 'ucfirst' || call.op === 'lcfirst') {
        if (value.charCodeAt(0) > 127) fail('Non-ASCII first-character casing remains unsupported');
        return (call.op === 'ucfirst' ? value.charAt(0).toUpperCase() : value.charAt(0).toLowerCase()) + value.slice(1);
      }
      if (call.op === '#expr') return arithmetic(value);
      if (call.op === '#len') return String(Array.from(value).length);
      function integer(index) {
        const number = Number(argument(index));
        if (!Number.isSafeInteger(number)) fail('Unsupported wiki string offset; expected a safe integer');
        return number;
      }
      if (call.op === '#sub') {
        const characters = Array.from(value);
        const offset = integer(1);
        const start = offset < 0 ? Math.max(0, characters.length + offset) : offset;
        const length = integer(2);
        const end = length > 0 ? start + length : length < 0 ? Math.max(0, characters.length + length) : characters.length;
        return characters.slice(start, end).join('');
      }
      if (call.op === '#pos' || call.op === '#rpos') {
        const search = argument(1) || ' ';
        const characters = Array.from(value);
        const offset = call.op === '#pos' ? integer(2) : 0;
        if (offset < 0 || offset > characters.length) fail('Unsupported wiki search offset');
        const suffix = characters.slice(offset).join('');
        const position = call.op === '#pos' ? suffix.indexOf(search) : suffix.lastIndexOf(search);
        return position < 0 ? call.op === '#pos' ? '' : '-1' : String(offset + Array.from(suffix.slice(0, position)).length);
      }
      if (call.op === '#replace') {
        const search = argument(1) || ' ';
        const replacement = argument(2);
        const pieces = value.split(search);
        if (value.length + (pieces.length - 1) * (replacement.length - search.length) > 32768) fail('Wiki replacement output limit exceeded', 'limit');
        return pieces.join(replacement);
      }
      fail(`Unsupported wiki operation: ${call.op}`);
    }
    return expand(program);
  }

  return Object.freeze({ parse, validate, evaluate, arithmetic, operation, supportedOperations, aliases });
});