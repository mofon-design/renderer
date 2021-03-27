'use strict';

const { parseSync } = require('@babel/core');
const createBabelParseError = require('./create-babel-parse-error');
const postprocess = require('./parse-postprocess');

function babel(text, parsers, opts = {}, parserOptions = {}) {
  const sourceType = opts.__babelSourceType === 'script' ? 'script' : 'module';
  const ast = parseSync(text, { ...parserOptions, sourceType });
  const error = ast.errors.find((error) => shouldRethrowRecoveredError(error));
  if (!ast) throw createBabelParseError(error);
  return postprocess(ast, { ...opts, originalText: text });
}

module.exports = function createBabelParser(options) {
  if (typeof options === 'string') return babel.apply(null, arguments);
  return function wrapped() {
    return babel.apply(null, [].concat(arguments).concat([options]));
  };
};

const allowedMessages = new Set([
  "The only valid numeric escape in strict mode is '\\0'",
  "'with' in strict mode",
  'Legacy octal literals are not allowed in strict mode',

  'Invalid left-hand side in parenthesized expression',
  'Invalid left-hand side in assignment expression',
  'Invalid left-hand side in postfix operation',
  'Invalid left-hand side in prefix operation',

  'Type argument list cannot be empty.',
  'Type parameter list cannot be empty.',
  'Type parameters cannot appear on a constructor declaration.',

  'A parameter property may not be declared using a binding pattern.',
  'A parameter property is only allowed in a constructor implementation.',

  'Tuple members must all have names or all not have names.',
  'Tuple members must be labeled with a simple identifier.',

  "'abstract' modifier can only appear on a class, method, or property declaration.",
  "'readonly' modifier can only appear on a property declaration or index signature.",
  "Class methods cannot have the 'declare' modifier",
  "Class methods cannot have the 'readonly' modifier",
  "'public' modifier cannot appear on a type member.",
  "'private' modifier cannot appear on a type member.",
  "'protected' modifier cannot appear on a type member.",
  "'static' modifier cannot appear on a type member.",
  "'declare' modifier cannot appear on a type member.",
  "'abstract' modifier cannot appear on a type member.",
  "'readonly' modifier cannot appear on a type member.",
  'Accessibility modifier already seen.',
  "Index signatures cannot have the 'declare' modifier",

  'Using the export keyword between a decorator and a class is not allowed. Please use `export @dec class` instead.',
  'Argument name clash',
  'Invalid decimal',
  'Unexpected trailing comma after rest element',
  'Decorators cannot be used to decorate parameters',
  'Unterminated JSX contents',
  'Invalid parenthesized assignment pattern',
  'Unexpected token, expected "}"',
  'Unexpected token :',
  "Unexpected reserved word 'package'",
  'Duplicate key "type" is not allowed in module attributes',
  "No line break is allowed before '=>'",
  'Invalid escape sequence in template',
  'Abstract methods can only appear within an abstract class.',
  'Decorators cannot be used to decorate object literal properties',
  'A required element cannot follow an optional element.',
  'A binding pattern parameter cannot be optional in an implementation signature.',
  'Initializers are not allowed in ambient contexts.',
  'A type-only import can specify a default import or named bindings, but not both.',
  'An implementation cannot be declared in ambient contexts.',
  "Classes may not have a field named 'constructor'",
]);

function shouldRethrowRecoveredError(error) {
  const [, message] = error.message.match(/(.*?)\s*\(\d+:\d+\)/);

  if (
    allowedMessages.has(message) ||
    /^Identifier '.*?' has already been declared$/.test(message) ||
    /^Private name #.*? is not defined$/.test(message) ||
    /^`.*?` has already been exported\. Exported identifiers must be unique\.$/.test(message)
  ) {
    return false;
  }

  return true;
}
