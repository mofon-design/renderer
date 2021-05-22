import type { Node } from './interface';

export function locStart(node: Node, opts: Record<PropertyKey, unknown> = {}): number {
  // Handle nodes with decorators. They should start at the first decorator
  if (!opts.ignoreDecorators) {
    if (
      'declaration' in node &&
      node.declaration &&
      'decorators' in node.declaration &&
      node.declaration.decorators?.length
    ) {
      return locStart(node.declaration.decorators[0]);
    }

    if ('decorators' in node && node.decorators?.length) {
      return locStart(node.decorators[0]);
    }
  }

  return node.range?.[0] ?? node.start ?? -1;
}

export function locEnd(node: Node): number {
  return node.range?.[1] ?? node.end ?? -1;
}

export function hasSameLocStart(nodeA: Node, nodeB: Node): boolean {
  return locStart(nodeA) === locStart(nodeB);
}

export function hasSameLocEnd(nodeA: Node, nodeB: Node): boolean {
  return locEnd(nodeA) === locEnd(nodeB);
}

export function hasSameLoc(nodeA: Node, nodeB: Node): boolean {
  return hasSameLocStart(nodeA, nodeB) && hasSameLocEnd(nodeA, nodeB);
}
