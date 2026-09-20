/** Contract and checked-source plumbing only; constructions live in each tool. */
import type {
  ToolExecutionContext,
  ToolJsonSchema,
} from "../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../core/result.js";
import { modelInputIssues } from "../core/model-definition.js";
import { simpleError } from "../core/simple.js";
import { calculateRandomItem } from "./item/tool.js";
import { runFrequency } from "../list/frequency/tool.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorRandom,
  type GeneratorReplay,
} from "./generator-random.js";
export {
  createModelDefinition,
  matchesModelInput,
} from "../core/model-definition.js";
export { simpleError } from "../core/simple.js";
export type { ToolExecutionContext } from "../core/definition.js";
export type { ToolExample } from "../core/example.js";
export type AcSeed = { readonly seed?: number };
export type AcReplay = { readonly randomness: GeneratorReplay };
export const num = { type: "number" } as const;
export const positive = { type: "number", exclusiveMinimum: 0 } as const;
export const nonnegative = { type: "number", minimum: 0 } as const;
export const label = { type: "string", minLength: 1, maxLength: 80 } as const;
export const bool = { type: "boolean" } as const;
export const integer = (minimum = 0, maximum = 128): ToolJsonSchema => ({
  type: "integer",
  minimum,
  maximum,
});
export const array = (
  items: ToolJsonSchema,
  maxItems = 128,
  minItems = 0,
): ToolJsonSchema => ({ type: "array", items, maxItems, minItems });
export const object = (
  properties: Readonly<Record<string, ToolJsonSchema>>,
  required: readonly string[] = Object.keys(properties),
): ToolJsonSchema => ({
  type: "object",
  additionalProperties: false,
  properties,
  required,
});
export const inputObject = (
  properties: Readonly<Record<string, ToolJsonSchema>>,
): ToolJsonSchema =>
  object({ ...properties, seed: generatorSeedSchema }, Object.keys(properties));
export const outputObject = (
  properties: Readonly<Record<string, ToolJsonSchema>>,
): ToolJsonSchema =>
  object({ ...properties, randomness: generatorReplaySchema });
export const strings = array(label, 16, 1);
export const countsSchema = array(
  object({ id: label, count: integer(0, 128) }),
  32,
);
export type AcCount = { readonly id: string; readonly count: number };
export const distinct = (values: readonly string[], field: string): void => {
  if (new Set(values).size !== values.length)
    simpleError(
      field,
      "Entries must have distinct identities.",
      "duplicate_entries",
    );
};
export const finite = (value: number, field = "dimensions"): number => {
  if (!Number.isFinite(value))
    return simpleError(
      field,
      "Arithmetic must remain finite.",
      "numeric_overflow",
    );
  return value === 0 ? 0 : value;
};
export const limit = (count: number, maximum = 128, field = "count"): void => {
  if (!Number.isSafeInteger(count) || count > maximum || count < 0)
    simpleError(
      field,
      "Requested construction exceeds its work or output budget.",
      "resource_limit_exceeded",
    );
};
export const ordered = (low: number, high: number, field: string): void => {
  if (high < low)
    simpleError(field, "Range endpoints must be ordered.", "invalid_range");
};
export const pick = <T>(values: readonly T[], random: GeneratorRandom): T => {
  const selected = calculateRandomItem(values, random.unit);
  if (selected === null)
    throw new Error("A checked nonempty item selection failed.");
  return selected;
};
export const counts = (
  values: readonly string[],
  ids: readonly string[],
): AcCount[] => {
  const result = runFrequency({ values });
  if (!result.ok)
    throw new Error("Constructed labels failed frequency counting.");
  return ids.map((id) => ({
    id,
    count: Object.hasOwn(result.output.frequencies, id)
      ? result.output.frequencies[id]
      : 0,
  }));
};
export const budget = (): (() => void) => {
  let nodes = 0;
  return () => {
    if (++nodes > 4096)
      simpleError(
        "constraints",
        "Randomized search reached 4096 states; feasibility is unresolved.",
        "search_exhausted",
      );
  };
};
/** Cyclic candidate order from one checked draw; not a uniform permutation. */
export const choices = <T>(
  values: readonly T[],
  random: GeneratorRandom,
): T[] => {
  if (values.length === 0) return [];
  const start = random.integer(0, values.length - 1);
  return [...values.slice(start), ...values.slice(0, start)];
};
export const run = <I extends AcSeed, O>(
  input: unknown,
  schema: ToolJsonSchema,
  guard: (value: unknown) => value is I,
  context: ToolExecutionContext | undefined,
  construct: (value: I, random: GeneratorRandom) => O,
): ToolResult<O & AcReplay> => {
  if (!guard(input)) return invalidInput(modelInputIssues(input, schema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    const output = {
      ...construct(input, random),
      randomness: generatorReplay(input.seed, context),
    };
    const visit = (value: unknown): void => {
      if (
        typeof value === "number" &&
        (!Number.isFinite(value) || Object.is(value, -0))
      )
        throw new Error("Nonportable constructed number.");
      if (Array.isArray(value)) value.forEach(visit);
      else if (value !== null && typeof value === "object")
        Object.values(value).forEach(visit);
      else if (value === undefined)
        throw new Error("Undefined constructed value.");
    };
    visit(output);
    if (JSON.stringify(output).length > 1_048_576)
      throw new Error("Construction violated its preflight output bound.");
    return toolSuccess(output);
  } catch (error) {
    return generatorFailure(error);
  }
};
