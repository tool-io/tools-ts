import { matchesModelInput } from "../core/model-definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../core/result.js";

export type RankCorrelationInput = {
  readonly first: readonly number[];
  readonly second: readonly number[];
};
export const rankCorrelationInputSchema = {
  additionalProperties: false,
  properties: {
    first: {
      items: { type: "number" },
      maxItems: 512,
      minItems: 2,
      type: "array",
    },
    second: {
      items: { type: "number" },
      maxItems: 512,
      minItems: 2,
      type: "array",
    },
  },
  required: ["first", "second"],
  type: "object",
} as const;
export const rankCorrelationInputPorts = [
  {
    id: "first",
    label: "First paired series",
    required: true,
    valueType: { items: { type: "number" }, type: "list" },
  },
  {
    id: "second",
    label: "Second paired series",
    required: true,
    valueType: { items: { type: "number" }, type: "list" },
  },
] as const;
const isInput = (input: unknown): input is RankCorrelationInput =>
  matchesModelInput(input, rankCorrelationInputSchema);

export const validateRankCorrelationInput = (
  input: unknown,
): ToolResult<RankCorrelationInput> => {
  if (!isInput(input))
    return invalidInput([
      {
        code: "invalid_paired_series",
        field: "first",
        message:
          "Provide two lists, each containing 2–512 finite numbers, and no other fields.",
      },
    ]);
  if (input.first.length !== input.second.length)
    return invalidInput([
      {
        code: "paired_length_mismatch",
        field: "second",
        message: "The paired series must have the same length.",
      },
    ]);
  return toolSuccess(input);
};

/** One-based midranks: equal observed values receive their average position. */
export const calculateAverageRanks = (
  values: readonly number[],
): readonly number[] => {
  const sorted = [...values].sort((a, b) => a - b);
  const ranks = new Map<number, number>();
  for (let start = 0; start < sorted.length;) {
    let end = start + 1;
    while (end < sorted.length && sorted[end] === sorted[start]) end += 1;
    const value = sorted[start];
    if (value !== undefined) ranks.set(value, (start + 1 + end) / 2);
    start = end;
  }
  return values.map((value) => ranks.get(value) ?? 0);
};
