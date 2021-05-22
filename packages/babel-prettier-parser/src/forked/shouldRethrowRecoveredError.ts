// Error codes are defined in
//  - https://github.com/babel/babel/blob/v7.14.0/packages/babel-parser/src/parser/error-message.js
//  - https://github.com/babel/babel/blob/v7.14.0/packages/babel-parser/src/plugins/typescript/index.js#L69-L153
//  - https://github.com/babel/babel/blob/v7.14.0/packages/babel-parser/src/plugins/flow/index.js#L51-L140
//  - https://github.com/babel/babel/blob/v7.14.0/packages/babel-parser/src/plugins/jsx/index.js#L23-L39
const allowedMessageCodes = new Set<string>([
  'StrictNumericEscape',
  'StrictWith',
  'StrictOctalLiteral',

  'EmptyTypeArguments',
  'EmptyTypeParameters',
  'ConstructorHasTypeParameters',

  'UnsupportedParameterPropertyKind',
  'UnexpectedParameterModifier',

  'MixedLabeledAndUnlabeledElements',
  'InvalidTupleMemberLabel',

  'NonClassMethodPropertyHasAbstractModifer',
  'ReadonlyForMethodSignature',
  'ClassMethodHasDeclare',
  'ClassMethodHasReadonly',
  'InvalidModifierOnTypeMember',
  'DuplicateAccessibilityModifier',
  'IndexSignatureHasDeclare',

  'DecoratorExportClass',
  'ParamDupe',
  'InvalidDecimal',
  'RestTrailingComma',
  'UnsupportedParameterDecorator',
  'UnterminatedJsxContent',
  'UnexpectedReservedWord',
  'ModuleAttributesWithDuplicateKeys',
  'LineTerminatorBeforeArrow',
  'InvalidEscapeSequenceTemplate',
  'NonAbstractClassHasAbstractMethod',
  'UnsupportedPropertyDecorator',
  'OptionalTypeBeforeRequired',
  'PatternIsOptional',
  'OptionalBindingPattern',
  'DeclareClassFieldHasInitializer',
  'TypeImportCannotSpecifyDefaultAndNamed',
  'DeclareFunctionHasImplementation',
  'ConstructorClassField',

  'VarRedeclaration',
  'InvalidPrivateFieldResolution',
  'DuplicateExport',
]);

export function shouldRethrowRecoveredError(error: unknown): boolean {
  if (typeof error !== 'object' || !error) return true;

  const record = error as Record<string, unknown>;
  if (typeof record.reasonCode !== 'string') return true;

  return !allowedMessageCodes.has(record.reasonCode);
}
