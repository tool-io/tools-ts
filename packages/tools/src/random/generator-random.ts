import type { ToolExecutionContext } from "../core/definition.js";
import {
  defaultRandomSeed,
  randomIndex,
  resolveRandom,
} from "../core/random.js";
import { SimpleToolError, simpleError } from "../core/simple.js";
import { invalidInput, type ToolResult } from "../core/result.js";
import { calculateRandomInteger } from "./number/tool.js";

export const generatorSeedSchema = {
  description:
    "Optional numeric seed; takes precedence over context randomness. Without either, use the fixed tool.io default seed.",
  type: "integer",
} as const;
export type GeneratorRandom = {
  readonly integer: (minimum: number, maximum: number) => number;
  readonly pick: <T>(values: readonly T[]) => T;
  readonly shuffle: <T>(values: readonly T[]) => T[];
  readonly unit: () => number;
};
export type GeneratorReplay = {
  readonly seed: number | null;
  readonly source: "context" | "seed";
};
export const generatorReplaySchema = {
  additionalProperties: false,
  properties: {
    seed: { anyOf: [{ type: "integer" }, { type: "null" }] },
    source: { enum: ["context", "seed"], type: "string" },
  },
  required: ["seed", "source"],
  type: "object",
} as const;
export const generatorReplay = (
  seed?: number,
  context?: ToolExecutionContext,
): GeneratorReplay =>
  seed === undefined && context?.random
    ? { seed: null, source: "context" }
    : { seed: (seed ?? defaultRandomSeed) >>> 0, source: "seed" };

/** Resolve exactly once per generation; every draw advances that same source. */
export const createGeneratorRandom = (
  seed?: number,
  context?: ToolExecutionContext,
): GeneratorRandom => {
  if (seed !== undefined && !Number.isSafeInteger(seed))
    simpleError("seed", "Seed must be a safe integer.", "invalid_seed");
  const source = resolveRandom(seed, context);
  const unit = (): number => {
    let value: number;
    try {
      value = source();
    } catch {
      return simpleError(
        "random",
        "The injected random source failed.",
        "invalid_random_source",
      );
    }
    if (
      typeof value !== "number" ||
      !Number.isFinite(value) ||
      value < 0 ||
      value >= 1
    )
      return simpleError(
        "random",
        "Random draws must be finite numbers in [0, 1).",
        "invalid_random_source",
      );
    return value;
  };
  const integer = (minimum: number, maximum: number): number => {
    const value = calculateRandomInteger(minimum, maximum, unit);
    return value === null
      ? simpleError(
          "maximum",
          "The inclusive integer range must be safe and ordered.",
          "invalid_integer_range",
        )
      : value;
  };
  const pick = <T>(values: readonly T[]): T => {
    if (values.length === 0)
      return simpleError(
        "values",
        "A selection requires at least one candidate.",
        "empty_candidates",
      );
    return values[randomIndex(values.length, unit)] as T;
  };
  return {
    integer,
    pick,
    unit,
    shuffle: <T>(values: readonly T[]): T[] => {
      const result = [...values];
      for (let i = result.length - 1; i > 0; i -= 1) {
        const j = randomIndex(i + 1, unit);
        const current = result[i] as T;
        result[i] = result[j] as T;
        result[j] = current;
      }
      return result;
    },
  };
};

export const generatorDefaultSeed = defaultRandomSeed;
/** Partial Fisher–Yates over a virtual [0, size) population; O(count) storage. */
export const generatorSampleIndices = (
  size: number,
  count: number,
  random: GeneratorRandom,
): number[] => {
  if (
    !Number.isSafeInteger(size) ||
    size < 0 ||
    !Number.isSafeInteger(count) ||
    count < 0 ||
    count > size
  )
    return simpleError(
      "count",
      "Choose a safe nonnegative count no greater than the virtual population.",
      "invalid_sample_size",
    );
  const swaps = new Map<number, number>(),
    result: number[] = [];
  let remaining = size;
  for (let i = 0; i < count; i += 1) {
    const slot = random.integer(0, remaining - 1),
      selected = swaps.get(slot) ?? slot;
    swaps.set(slot, swaps.get(remaining - 1) ?? remaining - 1);
    swaps.delete(remaining - 1);
    remaining -= 1;
    result.push(selected);
  }
  return result;
};
/** Catch only documented model/input failures; do not mask programming errors. */
export const generatorFailure = (error: unknown): ToolResult<never> => {
  if (error instanceof SimpleToolError)
    return invalidInput([
      { code: error.code, field: error.field, message: error.message },
    ]);
  throw error;
};
