'use strict';

const parse = require('babel-prettier-parser/src');
const { locStart, locEnd } = require('babel-prettier-parser/src/loc');
const { hasPragma } = require('./pragma');

module.exports = {
  languages: [{ name: 'ECMAScript', parsers: ['babel-es'] }],
  parsers: { 'babel-es': { astFormat: 'estree', hasPragma, locStart, locEnd, parse } },
};
