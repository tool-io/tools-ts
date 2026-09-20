import type { ToolJsonSchema } from "../core/definition.js";
import { matchesModelInput } from "../core/model-definition.js";
import type { ToolResult } from "../core/result.js";
import { simpleError } from "../core/simple.js";
import type { GeneratorRandom } from "./generator-random.js";
import { runDistance3d } from "../geometry/distance-3d/tool.js";

export const numberSchema = { type: "number" } as const;
export const positiveSchema = { type: "number", exclusiveMinimum: 0 } as const;
export const nonnegativeSchema = { type: "number", minimum: 0 } as const;
export const integerSchema = { type: "integer" } as const;
export const textSchema = { type: "string", maxLength: 256 } as const;
export const booleanSchema = { type: "boolean" } as const;
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
  maximum = 128,
  minimum = 0,
): ToolJsonSchema => ({
  type: "array",
  items,
  minItems: minimum,
  maxItems: maximum,
});
export const countSchema = (maximum = 128, minimum = 1): ToolJsonSchema => ({
  type: "integer",
  minimum,
  maximum,
});
export const enumSchema = (values: readonly string[]): ToolJsonSchema => ({
  type: "string",
  enum: values,
});
export type NumericRange = {
  readonly minimum: number;
  readonly maximum: number;
};
export const rangeSchema = (
  value: ToolJsonSchema = numberSchema,
): ToolJsonSchema => objectSchema({ minimum: value, maximum: value });
export const orderedRange = (range: NumericRange, field: string): void => {
  if (range.minimum > range.maximum)
    simpleError(field, "Range bounds must be ordered.", "inverted_range");
};
/** Convex interpolation avoids overflowing maximum - minimum. */
export const drawReal = (
  range: NumericRange,
  random: GeneratorRandom,
  field: string,
): number => {
  orderedRange(range, field);
  const u = random.unit();
  return finiteNumber(
    range.minimum === range.maximum
      ? range.minimum
      : range.minimum * (1 - u) + range.maximum * u,
    field,
  );
};
export const drawInteger = (
  range: NumericRange,
  random: GeneratorRandom,
  field: string,
): number => {
  orderedRange(range, field);
  return random.integer(range.minimum, range.maximum);
};
export const finiteNumber = (value: number, field: string): number => {
  if (!Number.isFinite(value))
    simpleError(
      field,
      "The requested calculation exceeds finite numeric representation.",
      "numeric_range",
    );
  return value === 0 ? 0 : value;
};
/** Narrow a legacy scalar payload through its actual runtime shape. */
export const legacyScalar = (output: {
  readonly result: Readonly<Record<string, unknown>>;
}): number => {
  const value = output.result.value;
  if (typeof value !== "number")
    throw new Error("A legacy scalar core changed its result shape.");
  return finiteNumber(value, "output");
};
export const requireDistinct = (
  values: readonly (string | number)[],
  field: string,
): void => {
  if (new Set(values).size !== values.length)
    simpleError(field, "Entries must be distinct.", "duplicate_entries");
};
/** Forward expected failures from a reused core without hiding programming errors. */
export const coreOutput = <T>(
  result: ToolResult<T>,
  inputFieldMap: Readonly<Record<string, string>> = {},
): T => {
  if (result.ok) return result.output;
  const issue = result.error.issues[0];
  if (
    !issue ||
    issue.code === "calculation_failed" ||
    issue.code === "invalid_output" ||
    result.error.code !== "invalid_input"
  )
    throw new Error(
      "A reused core failed unexpectedly: " +
        (issue?.message ?? "missing issue"),
    );
  return simpleError(
    Object.hasOwn(inputFieldMap, issue.field)
      ? inputFieldMap[issue.field]
      : issue.field,
    issue.message,
    issue.code,
  );
};
/** Delegate on normalized deltas so the legacy square-sum core retains finite range. */
export const distanceFromCore = (
  a: { readonly x: number; readonly y: number; readonly z: number },
  b: { readonly x: number; readonly y: number; readonly z: number },
  field: string,
): number => {
  const dx = finiteNumber(b.x - a.x, field),
    dy = finiteNumber(b.y - a.y, field),
    dz = finiteNumber(b.z - a.z, field);
  const scale = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz));
  if (scale === 0) return 0;
  const normalized = coreOutput(
    runDistance3d({
      x1: 0,
      y1: 0,
      z1: 0,
      x2: dx / scale,
      y2: dy / scale,
      z2: dz / scale,
    }),
  ).distance;
  return finiteNumber(normalized * scale, field);
};
export const ensureOutput = <T>(output: T, schema: ToolJsonSchema): T => {
  let nodes = 0,
    characters = 0;
  const active = new Set<object>();
  const visit = (value: unknown, depth: number): void => {
    nodes++;
    if (nodes > 50_000 || depth > 24)
      simpleError(
        "output",
        "Generated output exceeds the node or nesting budget.",
        "output_resource_limit",
      );
    if (typeof value === "number" && !Number.isFinite(value))
      simpleError(
        "output",
        "The requested model exceeds finite numeric representation.",
        "numeric_range",
      );
    if (typeof value === "string") {
      characters += value.length;
      if (value.length > 65_536 || characters > 1_000_000)
        simpleError(
          "output",
          "Generated text exceeds the output character budget.",
          "output_resource_limit",
        );
    }
    if (typeof value !== "object" || value === null) return;
    if (active.has(value))
      throw new Error("Generated output unexpectedly contains a cycle.");
    active.add(value);
    for (const child of Object.values(value)) visit(child, depth + 1);
    active.delete(value);
  };
  visit(output, 0);
  if (!matchesModelInput(output, schema))
    throw new Error(
      "Generated output does not match its concrete JSON schema.",
    );
  const serialized = JSON.stringify(output);
  if (serialized === undefined)
    throw new Error("Generated output has no JSON representation.");
  if (serialized.length > 1_000_000)
    simpleError(
      "output",
      "Serialized output exceeds one million characters.",
      "output_resource_limit",
    );
  return output;
};
