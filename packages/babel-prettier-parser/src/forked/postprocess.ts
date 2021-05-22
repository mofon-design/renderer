import types from '@babel/types';
import { isTypeCastComment } from './comments';
import type { Node, WithRange } from './interface';
import { locStart, locEnd } from './loc';
import { getNextNonSpaceNonCommentCharacter } from './utils';

export function postprocess(input: types.File, originalText: string): types.File {
  let output = input;

  // Keep Babel's non-standard ParenthesizedExpression nodes only if they have Closure-style type cast comments.
  const startOffsetsOfTypeCastedNodes = new Set<number>();

  // Comments might be attached not directly to ParenthesizedExpression but to its ancestor.
  // E.g.: /** @type {Foo} */ (foo).bar();
  // Let's use the fact that those ancestors and ParenthesizedExpression have the same start offset.

  output = visitNode(output, (node) => {
    if (node.leadingComments && node.leadingComments.some(isTypeCastComment)) {
      startOffsetsOfTypeCastedNodes.add(locStart(node));
    }
  });

  output = visitNode(output, (node) => {
    if (node.type === 'ParenthesizedExpression') {
      const { expression } = node;

      // Align range with `flow`
      if (expression.type === 'TypeCastExpression') {
        (expression as WithRange<types.TypeCastExpression>).range = node.range;
        return expression;
      }

      const start = locStart(node);
      if (!startOffsetsOfTypeCastedNodes.has(start)) {
        expression.extra = { ...expression.extra, parenthesized: true };
        return expression;
      }
    }
  });

  output = visitNode(output, (node) => {
    switch (node.type) {
      case 'LogicalExpression': {
        // We remove unneeded parens around same-operator LogicalExpressions
        if (isUnbalancedLogicalTree(node)) {
          return rebalanceLogicalTree(node);
        }
        break;
      }
      // fix unexpected locEnd caused by --no-semi style
      case 'VariableDeclaration': {
        const { length } = node.declarations;
        const lastDeclaration = length ? node.declarations[length - 1] : null;
        if (lastDeclaration && lastDeclaration.init) {
          overrideLocEnd(node, lastDeclaration);
        }
        break;
      }
      // remove redundant TypeScript nodes
      case 'TSParenthesizedType': {
        (node.typeAnnotation as WithRange<types.TSType>).range = [locStart(node), locEnd(node)];
        return node.typeAnnotation;
      }
      case 'TSTypeParameter':
        // babel-ts
        if (typeof node.name === 'string') {
          const start = locStart(node);
          const name: WithRange<types.Identifier> = types.identifier(node.name);
          name.range = [start, start + node.name.length];
          (node as Record<'name', unknown>).name = name;
        }
        break;
      case 'SequenceExpression': {
        // Babel (unlike other parsers) includes spaces and comments in the range. Let's unify this.
        const { length } = node.expressions;
        const lastExpression = length ? node.expressions[length - 1] : null;
        if (lastExpression) {
          node.range = [locStart(node), Math.min(locEnd(lastExpression), locEnd(node))];
        }
        break;
      }
      case 'ClassProperty':
        // TODO: Temporary auto-generated node type. To remove when typescript-estree has proper support for private fields.
        if (
          node.key &&
          (node.key.type as string) === 'TSPrivateIdentifier' &&
          getNextNonSpaceNonCommentCharacter(originalText, node.key, locEnd) === '?'
        ) {
          node.optional = true;
        }
        break;
    }
  });

  return output;

  /**
   * - `toOverrideNode` must be the last thing in `toBeOverriddenNode`
   * - do nothing if there's a semicolon on `toOverrideNode.end` (no need to fix)
   */
  function overrideLocEnd(toBeOverriddenNode: Node, toOverrideNode: Node): void {
    const endOfToOverrideNode = locEnd(toOverrideNode);

    if (originalText[endOfToOverrideNode] !== ';') {
      toBeOverriddenNode.range = [locStart(toBeOverriddenNode), endOfToOverrideNode];
    }
  }
}

function visitNode<T extends Node>(node: T, fn: (node: Node) => Node | void): T;
function visitNode(node: Node, fn: (node: Node) => Node | void): Node {
  let entries;

  if (Array.isArray(node)) {
    entries = node.entries();
  } else if (node && typeof node === 'object' && typeof node.type === 'string') {
    entries = Object.entries(node);
  } else {
    return node;
  }

  for (const [key, child] of entries) {
    ((node as unknown) as Record<PropertyKey, unknown>)[key] = visitNode(child, fn);
  }

  if (Array.isArray(node)) {
    return node;
  }

  return fn(node) || node;
}

function isUnbalancedLogicalTree(
  node: Node,
): node is WithRange<types.LogicalExpression> & { right: WithRange<types.LogicalExpression> } {
  return (
    node.type === 'LogicalExpression' &&
    node.right.type === 'LogicalExpression' &&
    node.operator === node.right.operator
  );
}

function rebalanceLogicalTree(
  node: WithRange<types.LogicalExpression>,
): WithRange<types.LogicalExpression>;
function rebalanceLogicalTree<T extends Node>(node: T): T;
function rebalanceLogicalTree(
  node: WithRange<types.LogicalExpression>,
): WithRange<types.LogicalExpression> {
  if (!isUnbalancedLogicalTree(node)) {
    return node;
  }

  const left: WithRange<types.LogicalExpression> = types.logicalExpression(
    node.operator,
    node.left,
    node.right.left,
  );

  left.range = [locStart(node.left), locEnd(node.right.left)];

  const rebalanced: WithRange<types.LogicalExpression> = types.logicalExpression(
    node.operator,
    rebalanceLogicalTree(left),
    node.right.right,
  );

  rebalanced.range = [locStart(node), locEnd(node)];

  return rebalanceLogicalTree(rebalanced);
}
