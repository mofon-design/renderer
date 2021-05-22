import type { Comment, CommentBlock } from '@babel/types';

export function isTypeCastComment(comment: Comment): boolean {
  return (
    isBlockComment(comment) &&
    comment.value[0] === '*' &&
    // TypeScript expects the type to be enclosed in curly brackets, however
    // Closure Compiler accepts types in parens and even without any delimiters at all.
    // That's why we just search for "@type".
    /@type\b/.test(comment.value)
  );
}

function isBlockComment(comment: Comment): comment is CommentBlock {
  return comment.type === 'CommentBlock';
}
