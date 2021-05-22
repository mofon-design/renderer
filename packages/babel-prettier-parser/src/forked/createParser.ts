import type { Parser } from 'prettier';
import type { Node } from './interface';
import { locStart, locEnd } from './loc';
import { hasPragma } from './pragma';

export function createParser(options: Parser<Node> | Parser<Node>['parse']): Parser<Node> {
  const override = typeof options === 'function' ? { parse: options } : options;

  return { astFormat: 'estree', hasPragma, locStart, locEnd, ...override };
}
