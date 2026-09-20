import type { ToolJsonSchema } from "../core/definition.js";
import { matchesToolJsonSchema } from "../core/contract.js";
import { toolSuccess, type ToolResult } from "../core/result.js";
import { simpleError } from "../core/simple.js";
import { calculateRandomItem } from "./item/tool.js";
import type { GeneratorRandom } from "./generator-random.js";
import { calculateRandomTimestampValue } from "./timestamp/tool.js";
import { runFrequency } from "../list/frequency/tool.js";
import { runAddDays } from "../date/add-days/tool.js";
import { runDifference } from "../date/difference/tool.js";

export const mocksText = { type: "string", maxLength: 4096 } as const;
export const mocksLabel = {
  type: "string",
  minLength: 1,
  maxLength: 128,
  pattern: "^[^\\r\\n]+(?![\\s\\S])",
} as const;
export const mocksInteger = { type: "integer" } as const;
export const mocksNumber = { type: "number" } as const;
export const mocksBoolean = { type: "boolean" } as const;
export const mocksCount = {
  type: "integer",
  minimum: 1,
  maximum: 128,
} as const;
export const mocksProbability = {
  type: "number",
  minimum: 0,
  maximum: 1,
} as const;
export const mocksDate = {
  type: "string",
  pattern: "^(?:0[1-9][0-9]{2}|[1-9][0-9]{3})-[0-9]{2}-[0-9]{2}(?![\\s\\S])",
} as const;
export const mocksArray = (
  items: ToolJsonSchema,
  maxItems = 128,
  minItems = 0,
): ToolJsonSchema => ({ type: "array", items, maxItems, minItems });
export const mocksObject = (
  properties: Readonly<Record<string, ToolJsonSchema>>,
  required: readonly string[] = Object.keys(properties),
): ToolJsonSchema => ({
  type: "object",
  additionalProperties: false,
  properties,
  required,
});
export const mocksNullable = (schema: ToolJsonSchema): ToolJsonSchema => ({
  anyOf: [schema, { type: "null" }],
});
export const mocksDistinct = (
  values: readonly string[],
  field: string,
): void => {
  if (new Set(values).size !== values.length)
    simpleError(field, "Values must be distinct.", "duplicate_value");
};
export const mocksOrdered = (
  minimum: number,
  maximum: number,
  field: string,
): void => {
  if (minimum > maximum)
    simpleError(field, "Bounds must be ordered.", "inverted_range");
};
export const mocksSafe = (value: number, field: string): number => {
  if (!Number.isSafeInteger(value))
    simpleError(
      field,
      "Arithmetic must remain within safe integer precision.",
      "unsafe_integer",
    );
  return value;
};
export const mocksFinite = (value: number, field: string): number => {
  if (!Number.isFinite(value))
    simpleError(
      field,
      "Arithmetic exceeds the finite number range.",
      "numeric_overflow",
    );
  return value;
};
/** Reuse the item core with the generation's one checked advancing source. */
export const mocksPick = <T>(
  values: readonly T[],
  random: GeneratorRandom,
): T => {
  const value = calculateRandomItem(values, random.unit);
  if (value === null)
    throw new Error("A nonempty validated bank was rejected by the item core.");
  return value;
};
/** Preserve expected delegated issues; expose legacy catch-all failures as programming errors. */
export const mocksCore = <T>(result: ToolResult<T>, field: string): T => {
  if (result.ok) return result.output;
  const issue = result.error.issues[0];
  if (!issue || issue.code === "calculation_failed")
    throw new Error("A delegated core failed unexpectedly.");
  return simpleError(field, issue.message, issue.code);
};
export const mocksFinish = <T>(
  output: T,
  schema: ToolJsonSchema,
): ToolResult<T> => {
  if (JSON.stringify(output).length > 1_000_000)
    simpleError(
      "output",
      "Serialized output exceeds 1,000,000 UTF-16 code units.",
      "resource_limit_exceeded",
    );
  // Output is constructed from guarded dense input; the input walker's node budget
  // must not accidentally impose a second, smaller output limit on large traces.
  if (!matchesToolJsonSchema(output, schema))
    throw new Error("Generated output violates its portable schema.");
  return toolSuccess(output);
};
export const mocksTimestamp = (
  start: number,
  end: number,
  random: GeneratorRandom,
): number => {
  mocksOrdered(start, end, "endMilliseconds");
  mocksSafe(end - start + 1, "endMilliseconds");
  const value = calculateRandomTimestampValue(
    start,
    end,
    "milliseconds",
    random.unit,
  );
  if (value === null || !Number.isSafeInteger(value))
    throw new Error(
      "Validated timestamp construction returned an invalid result.",
    );
  return value;
};
export const mocksFrequencies = (
  values: readonly string[],
): readonly { readonly label: string; readonly count: number }[] => {
  const output = mocksCore(runFrequency({ values }), "values");
  return Object.entries(output.frequencies).map(([label, count]) => ({
    label,
    count,
  }));
};
export const mocksAddDays = (date: string, days: number): string => {
  const output = mocksCore(runAddDays({ date, days }), "date").date;
  if (!mocksDate.pattern || !new RegExp(mocksDate.pattern).test(output))
    simpleError(
      "date",
      "Generated dates must stay in years 0100 through 9999.",
      "date_out_of_range",
    );
  return output;
};
export const mocksDays = (startDate: string, endDate: string): number =>
  mocksCore(runDifference({ startDate, endDate }), "endDateExclusive").days;
