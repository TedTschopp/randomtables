(function (root) {
  'use strict';
  const data = {
    'array implode': {
      revision: 40163,
      source: "{{#if:{{{1|}}}|\n{{#ifeq:{{#rpos:{{{1}}}|{{!}}}}|-1|{{{1}}}|\n  {{#if:{{{2|}}}|\n    {{#if:{{{3|}}}|\n      {{#replace:\n        {{#sub:{{{1}}}|0|{{#rpos:{{{1}}}|{{!}}}} }}{{{3}}}{{#sub:{{{1}}}|{{#expr:{{#rpos:{{{1}}}|{{!}}}}+1}} }}\n      |{{!}}|{{{2}}}}}\n    |\n      {{#replace:{{{1}}}|{{!}}|{{{2}}}}}\n    }}\n  |\n    {{#replace:{{{1}}}|{{!}}|,&#32;}}\n  }}\n}}\n\n\n\n|}}"
    },
    'array norepeat': {
      revision: 40044,
      source: "{{#if: {{{1|}}} |\n  {{#if: {{#pos: {{!}}{{{1}}} | {{!}}{{{2}}} }} |\n    {{{1}}}\n  |\n    {{#if: {{{2|}}} |\n      {{{1}}}{{!}}{{{2}}}\n    |\n      {{{1}}}\n    }}\n  }}\n|\n  {{{2|}}}\n}}"
    },
    article: {
      revision: 29088,
      source: "{{lcfirst:{{#ifeq:{{lc:{{#sub:{{{1|}}}|0|3}}}}|uni|\n  a {{{1}}}|\n  {{#ifeq:{{lc:{{#sub:{{{1|}}}|0|1}}}}|a|\n    an {{{1}}}|\n    {{#ifeq:{{lc:{{#sub:{{{1|}}}|0|1}}}}|e|\n      an {{{1}}}|\n      {{#ifeq:{{lc:{{#sub:{{{1|}}}|0|1}}}}|i|\n        an {{{1}}}|\n        {{#ifeq:{{lc:{{#sub:{{{1|}}}|0|1}}}}|o|\n          an {{{1}}}|\n          {{#ifeq:{{lc:{{#sub:{{{1|}}}|0|1}}}}|u|\n            an {{{1}}}|\n            a {{{1|}}}\n          }}\n        }}\n      }}\n    }}\n  }}\n}}}}"
    },
    concat: {
      revision: 36814,
      source: "{{#ifeq:{{#sub:{{{1}}}|{{#expr:{{#len:{{{1}}}}}-1}}|1}}|{{#sub:{{{2}}}|0|1}}|{{{1}}}{{#sub:{{{2}}}|1}}|{{{1}}}{{{2}}}}}"
    },
    numtostring: {
      revision: 36911,
      source: "{{#switch: {{{1}}} | 1 =one| 2 =two| 3 =three| 4 =four| 5 =five| 6 =six| 7 =seven| 8 =eight| 9 =nine| 10 =ten| 11 =eleven| 12 =twelve| 13 = thirteen | 14 = fourteen | 15 = fifteen | 16 = sixteen | 17 = seventeen | 18 = eighteen | 19 = nineteen | 20 = twenty | 1 = twenty-one | 2 = twenty-two | 3 = twenty-three | 4 = twenty-four | 5 = twenty-five | 6 = twenty-six }}"
    },
    plural: {
      revision: 39767,
      source: "{{#ifeq: {{lc:{{#sub:{{{1|}}}|0|4}}}} |one |\n  {{{1}}}|\n  {{#ifeq:{{#sub:{{{1|}}}|0|2}}|1 |\n    {{{1}}}|\n    {{#ifeq:{{lc:{{#sub:{{{1|}}}|0|2}}}}|a |\n      {{{1}}}|\n      {{#ifeq:{{lc:{{#sub:{{{1|}}}|0|3}}}}|an |\n        {{{1}}}|\n        {{#ifeq:{{lc:{{#sub:{{{1|}}}|-2}}}}|us|\n          {{#sub:{{{1|}}}|0|-2}}i|\n          {{#ifeq:{{lc:{{#sub:{{{1|}}}|-1}}}}|s|\n            {{{1}}}es|\n            {{#ifeq:{{lc:{{#sub:{{{1|}}}|-1}}}}|x|\n              {{{1}}}es|\n              {{#ifeq:{{lc:{{#sub:{{{1|}}}|-1}}}}|z|\n                {{{1}}}es|\n                {{#ifeq:{{lc:{{#sub:{{{1|}}}|-2}}}}|sh|\n                  {{{1}}}es|\n                  {{#ifeq:{{lc:{{#sub:{{{1|}}}|-2}}}}|ch|\n                    {{{1}}}es|\n                    {{#if:{{{2|}}}|{{{2}}}|{{{1}}}s}}\n                  }}\n                }}\n              }}\n            }}\n          }}\n        }}\n      }}\n    }}\n  }}\n}}"
    },
    po: {
      revision: 28408,
      source: "{{#ifeq:{{lc:{{#sub:{{{1|}}}|-1|1}}}}|s|\n  {{{1}}}\u2019|\n        {{#if:{{{2|}}}|{{{2}}}|{{{1}}}\u2019s}}\n      }}"
    },
    pronoun: {
      revision: 37261,
      source: "{{#ifeq: {{{2}}} | m | {{#replace:{{#replace:{{#replace:{{#replace:{{{1}}}|!HESHE|he}}|!HIMHER|him}}|!HISHER|his}}|. h|. H}}|}}{{#ifeq: {{{2}}} | f | {{#replace:{{#replace:{{#replace:{{#replace:{{#replace:{{{1}}}|!HESHE|she}}|!HIMHER|her}}|!HISHER|her}}|. h|. H}}|. s|. S}}|}}{{#ifeq: {{{2}}} | z | {{#replace:{{#replace:{{#replace:{{#replace:{{{1}}}|!HESHE|they}}|!HIMHER|them}}|!HISHER|their}}|. t|. T}}|}}"
    },
    'psychon norepeat': {
      revision: 40153,
      source: "{{#if:{{{1|}}}|\n{{#ifeq:{{#rpos:{{{1}}}|{{!}}}}|-1|{{{1}}}|\n  {{#if:{{{2|}}}|\n    {{#if:{{{3|}}}|\n      {{#replace:\n        {{#sub:{{{1}}}|0|{{#rpos:{{{1}}}|{{!}}}} }}{{{3}}}{{#sub:{{{1}}}|{{#expr:{{#rpos:{{{1}}}|{{!}}}}+1}} }}\n      |{{!}}|{{{2}}}}}\n    |\n      {{#replace:{{{1}}}|{{!}}|{{{2}}}}}\n    }}\n  |\n    {{#replace:{{{1}}}|{{!}}|,&#32;}}\n  }}\n}}\n\n\n\n|}}"
    }
  };
  for (const definition of Object.values(data)) Object.freeze(definition);
  Object.freeze(data);
  if (typeof module === 'object' && module.exports) module.exports = data;
  else Object.defineProperty(root, 'WikiTemplateData', { value: data });
})(globalThis);