import type {
  ToolExecutionContext,
  ToolJsonSchema,
} from "../core/definition.js";
import {
  matchesModelInput,
  modelInputIssues,
} from "../core/model-definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../core/result.js";
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

export type FcSeed = { readonly seed?: number };
export type FcReplay = { readonly randomness: GeneratorReplay };
export const fcText = { type: "string", maxLength: 2048 } as const;
export const fcId = {
  type: "string",
  minLength: 1,
  maxLength: 64,
  pattern: "^[A-Za-z0-9][A-Za-z0-9_-]*(?![\\s\\S])",
} as const;
export const fcNumber = { type: "number" } as const;
export const fcBoolean = { type: "boolean" } as const;
export const fcInteger = (
  minimum = 0,
  maximum = Number.MAX_SAFE_INTEGER,
): ToolJsonSchema => ({ type: "integer", minimum, maximum });
export const fcArray = (
  items: ToolJsonSchema,
  maxItems = 128,
  minItems = 0,
): ToolJsonSchema => ({ type: "array", items, minItems, maxItems });
export const fcObject = (
  properties: Readonly<Record<string, ToolJsonSchema>>,
  required = Object.keys(properties),
): ToolJsonSchema => ({
  type: "object",
  additionalProperties: false,
  properties,
  required,
});
export const fcInput = (
  properties: Readonly<Record<string, ToolJsonSchema>>,
): ToolJsonSchema =>
  fcObject(
    { ...properties, seed: generatorSeedSchema },
    Object.keys(properties),
  );
export const fcOutput = (
  properties: Readonly<Record<string, ToolJsonSchema>>,
): ToolJsonSchema =>
  fcObject({ ...properties, randomness: generatorReplaySchema });
export { matchesModelInput };
export const fcUnique = <T>(values: readonly T[], field: string): void => {
  if (new Set(values).size !== values.length)
    simpleError(field, "Values must be distinct.", "duplicate_identity");
};
export const fcPick = <T>(values: readonly T[], random: GeneratorRandom): T => {
  const chosen = calculateRandomItem(values, random.unit);
  if (chosen === null)
    return simpleError(
      "candidates",
      "A choice requires at least one supplied candidate.",
      "empty_candidates",
    );
  return chosen;
};
/** Random cyclic candidate order, with one checked draw even for a singleton. */
export const fcChoices = <T>(
  values: readonly T[],
  random: GeneratorRandom,
): T[] => {
  if (!values.length) return [];
  const start = random.integer(0, values.length - 1);
  return [...values.slice(start), ...values.slice(0, start)];
};
export const fcCounts = (
  values: readonly string[],
  identities: readonly string[],
): { id: string; count: number }[] => {
  const result = runFrequency({ values });
  if (!result.ok)
    throw new Error(
      "Bounded string frequencies were rejected by the existing core.",
    );
  return identities.map((id) => ({
    id,
    count: Object.hasOwn(result.output.frequencies, id)
      ? (result.output.frequencies[id] ?? 0)
      : 0,
  }));
};
export const fcCountSchema = fcArray(
  fcObject({ id: fcId, count: fcInteger() }),
);
export const fcFinite = (value: number, field: string): number => {
  if (!Number.isFinite(value))
    return simpleError(
      field,
      "The requested geometry exceeds finite numeric precision.",
      "numeric_overflow",
    );
  return value;
};
export const fcBudget = (limit = 50_000): (() => void) => {
  let visited = 0;
  return () => {
    if (++visited > limit)
      simpleError(
        "constraints",
        "The bounded search budget was exhausted; feasibility is unknown.",
        "search_limit_exceeded",
      );
  };
};
/** Only contract/random/error boilerplate; each caller implements its own model. */
export const fcRun = <I extends FcSeed, O extends object>(
  input: unknown,
  schema: ToolJsonSchema,
  guard: (value: unknown) => value is I,
  context: ToolExecutionContext | undefined,
  generate: (value: I, random: GeneratorRandom) => O,
): ToolResult<O & FcReplay> => {
  if (!guard(input)) return invalidInput(modelInputIssues(input, schema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    const output = {
      ...generate(input, random),
      randomness: generatorReplay(input.seed, context),
    };
    if (JSON.stringify(output).length > 1_048_576)
      simpleError(
        "output",
        "The generated output exceeds one MiB of JSON characters.",
        "resource_limit_exceeded",
      );
    return toolSuccess(output);
  } catch (error) {
    return generatorFailure(error);
  }
};
