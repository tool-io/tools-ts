import type { ToolJsonSchema } from "../core/definition.js";
import type { ToolResult } from "../core/result.js";
import { simpleError } from "../core/simple.js";

/** Schema vocabulary only; each tool owns its model and executor. */
export const objectSchema = (
  properties: Readonly<Record<string, ToolJsonSchema>>,
  required: readonly string[] = Object.keys(properties),
): ToolJsonSchema => ({
  type: "object",
  additionalProperties: false,
  properties,
  required,
});
export const arraySchema = (
  items: ToolJsonSchema,
  maxItems: number,
  minItems = 0,
): ToolJsonSchema => ({ type: "array", items, maxItems, minItems });
export const integerSchema = { type: "integer" } as const;
export const booleanSchema = { type: "boolean" } as const;
export const textSchema = { type: "string", maxLength: 64 } as const;
export const countSchema = (maximum: number, minimum = 0): ToolJsonSchema => ({
  type: "integer",
  minimum,
  maximum,
});
export const enumSchema = (values: readonly string[]): ToolJsonSchema => ({
  type: "string",
  enum: values,
});
export const nullableSchema = (schema: ToolJsonSchema): ToolJsonSchema => ({
  anyOf: [schema, { type: "null" }],
});
export const distinct = <T>(values: readonly T[], field: string): void => {
  if (new Set(values).size !== values.length)
    simpleError(field, "Entries must be distinct.", "duplicate_entries");
};
export const ordered = (
  minimum: number,
  maximum: number,
  field = "maximumValue",
): void => {
  if (minimum > maximum || !Number.isSafeInteger(maximum - minimum + 1))
    simpleError(
      field,
      "The inclusive integer range must be safe and ordered.",
      "invalid_integer_range",
    );
};
export const safeInteger = (value: bigint, field: string): number => {
  if (
    value < -BigInt(Number.MAX_SAFE_INTEGER) ||
    value > BigInt(Number.MAX_SAFE_INTEGER)
  )
    return simpleError(
      field,
      "The exact aggregate must fit a safe integer.",
      "unsafe_aggregate",
    );
  return Number(value);
};
export const coreOutput = <T>(result: ToolResult<T>): T => {
  if (!result.ok)
    throw new Error(
      "A constructed input was rejected by its reviewed core: " +
        JSON.stringify(result.error),
    );
  return result.output;
};
