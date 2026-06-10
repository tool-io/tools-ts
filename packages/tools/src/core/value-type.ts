export const toolValuePrimitives = [
  "null",
  "boolean",
  "integer",
  "number",
  "string",
  "bytes",
  "list",
  "object",
] as const;

export type ToolValuePrimitive = (typeof toolValuePrimitives)[number];

export type ToolValueType = {
  readonly format?: string;
  readonly items?: ToolValueType;
  readonly type: ToolValuePrimitive;
  readonly unit?: string;
};

const primitiveSet = new Set<string>(toolValuePrimitives);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isOptionalNonEmptyString = (value: unknown): boolean =>
  value === undefined ||
  (typeof value === "string" && value.trim().length > 0);

export const isToolValueType = (value: unknown): value is ToolValueType => {
  if (!isRecord(value) || !primitiveSet.has(String(value.type))) return false;
  if (!isOptionalNonEmptyString(value.format)) return false;
  if (!isOptionalNonEmptyString(value.unit)) return false;
  if (value.items !== undefined) {
    if (value.type !== "list" || !isToolValueType(value.items)) return false;
  }
  return true;
};

type CanonicalValueTypeTuple = readonly [
  ToolValuePrimitive,
  string | null,
  string | null,
  CanonicalValueTypeTuple | null,
];

const canonicalTuple = (
  valueType: ToolValueType,
): CanonicalValueTypeTuple => [
  valueType.type,
  valueType.format ?? null,
  valueType.unit ?? null,
  valueType.items ? canonicalTuple(valueType.items) : null,
];

export const toolValueTypeKey = (valueType: ToolValueType): string =>
  JSON.stringify(canonicalTuple(valueType));
