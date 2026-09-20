import type { ToolJsonSchema } from "../core/definition.js";
import type { ToolResult } from "../core/result.js";
import { simpleError } from "../core/simple.js";
import { addNumbers } from "../arithmetic/add-numbers/tool.js";

/** Small schema and finite-arithmetic primitives, not a model dispatcher. */
export const object = (
  properties: Readonly<Record<string, ToolJsonSchema>>,
  required: readonly string[] = Object.keys(properties),
): ToolJsonSchema => ({
  type: "object",
  additionalProperties: false,
  properties,
  required,
});
export const array = (
  items: ToolJsonSchema,
  maxItems = 128,
  minItems = 0,
): ToolJsonSchema => ({ type: "array", items, maxItems, minItems });
export const integer = { type: "integer" } as const;
export const number = { type: "number" } as const;
export const bool = { type: "boolean" } as const;
export const label = {
  type: "string",
  minLength: 1,
  maxLength: 64,
  pattern: "^[^\\u0000-\\u001f\\u007f]+(?![\\s\\S])",
} as const;
export const core = <T>(result: ToolResult<T>): T => {
  if (!result.ok)
    throw new Error(
      "A validated construction was rejected by its delegated core: " +
        JSON.stringify(result.error),
    );
  return result.output;
};
export const finite = (value: number, field = "values"): number => {
  if (!Number.isFinite(value))
    return simpleError(
      field,
      "Arithmetic exceeds the finite number range.",
      "nonfinite_arithmetic",
    );
  return Object.is(value, -0) ? 0 : value;
};
export const safe = (value: number, field = "values"): number => {
  if (!Number.isSafeInteger(value))
    return simpleError(
      field,
      "Exact arithmetic exceeds the safe integer range.",
      "unsafe_arithmetic",
    );
  return Object.is(value, -0) ? 0 : value;
};
export const distinct = (
  values: readonly (string | number)[],
  field: string,
): void => {
  if (new Set(values).size !== values.length)
    simpleError(field, "Entries must be distinct.", "duplicate_entries");
};
export const sum = (values: readonly number[], field = "values"): number => {
  if (!values.length) return 0;
  const result = addNumbers(values);
  if (result === null)
    return simpleError(field, "Sum is undefined.", "nonfinite_arithmetic");
  return finite(result, field);
};
/** Bound serialized output and expose programming/schema mistakes as exceptions. */
export const finish = <T>(value: T): T => {
  const visit = (v: unknown): void => {
    if (typeof v === "number" && !Number.isFinite(v))
      throw new Error("Construction produced a nonportable number.");
    if (v === undefined) throw new Error("Construction produced undefined.");
    // Callers pass freshly constructed output records/arrays, never caller inputs.
    if (v && typeof v === "object")
      for (const [key, x] of Object.entries(v)) {
        if (typeof x === "number" && Object.is(x, -0)) Reflect.set(v, key, 0);
        else visit(x);
      }
  };
  visit(value);
  if (JSON.stringify(value).length > 262144)
    throw new Error("Construction exceeded its 256 KiB character budget.");
  return value;
};
