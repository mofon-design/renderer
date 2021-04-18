let hidden = false;

export function hideDEP0097(): void {
  if (hidden) return;

  hidden = true;
  const origin = process.emitWarning;
  emitWarning.origin = origin;
  process.emitWarning = emitWarning;

  function emitWarning() {
    if (arguments[2] === 'DEP0097') return;
    origin.apply(process, arguments as never);
  }
}
