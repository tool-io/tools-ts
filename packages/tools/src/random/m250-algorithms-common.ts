import type { ToolJsonSchema } from "../core/definition.js";
import { simpleError } from "../core/simple.js";
import { calculateRandomItem } from "./item/tool.js";
import type { GeneratorRandom } from "./generator-random.js";

export const numberSchema = { type: "number" } as const;
export const probabilitySchema = {
  type: "number",
  minimum: 0,
  maximum: 1,
} as const;
export const positiveSupportSchema = {
  type: "number",
  exclusiveMinimum: 0,
  maximum: 1,
} as const;
export const labelSchema = {
  type: "string",
  minLength: 1,
  maxLength: 64,
} as const;
export const integerSchema = (
  minimum: number,
  maximum?: number,
): ToolJsonSchema => ({
  type: "integer",
  minimum,
  ...(maximum === undefined ? {} : { maximum }),
});
export const arraySchema = (
  items: ToolJsonSchema,
  maximum: number,
  minimum = 0,
): ToolJsonSchema => ({
  type: "array",
  items,
  maxItems: maximum,
  minItems: minimum,
});
export const objectSchema = (
  properties: Readonly<Record<string, ToolJsonSchema>>,
  required: readonly string[] = Object.keys(properties),
): ToolJsonSchema => ({
  type: "object",
  additionalProperties: false,
  properties,
  required,
});
export const nullable = (schema: ToolJsonSchema): ToolJsonSchema => ({
  anyOf: [schema, { type: "null" }],
});
export const finite = (value: number, field: string): number =>
  Number.isFinite(value)
    ? value
    : simpleError(field, "Arithmetic must remain finite.", "numeric_overflow");
export const distinctLabels = (
  labels: readonly string[],
  field: string,
): void => {
  if (labels.some((label) => !label.trim() || label.includes("\u0000")))
    simpleError(
      field,
      "Use nonblank labels without NUL characters.",
      "invalid_label",
    );
  if (new Set(labels).size !== labels.length)
    simpleError(
      field,
      "Labels must be distinct (case sensitive).",
      "duplicate_items",
    );
};
export const pickItem = <T>(
  values: readonly T[],
  random: GeneratorRandom,
): T => {
  const value = calculateRandomItem(values, random.unit);
  if (value === null)
    throw new Error(
      "A checked source and nonempty collection failed random/item.",
    );
  return value;
};
export const realDraw = (
  minimum: number,
  maximum: number,
  random: GeneratorRandom,
  field: string,
): number => {
  if (minimum > maximum)
    simpleError(field, "Range endpoints must be ordered.", "invalid_range");
  const u = random.unit();
  return minimum === maximum
    ? minimum
    : finite((1 - u) * minimum + u * maximum, field);
};
export const safeRange = (
  minimum: number,
  maximum: number,
  field: string,
): void => {
  if (minimum > maximum || !Number.isSafeInteger(maximum - minimum + 1))
    simpleError(
      field,
      "The inclusive integer range must be safe and ordered.",
      "invalid_integer_range",
    );
};
