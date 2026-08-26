import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BeersInterpolationLookupInput = {
  readonly groupedTotals: readonly number[];
  readonly groupOrdinal: number;
  readonly ordinalPosition: number;
  readonly method?: "ordinary" | "modified";
};

export type BeersInterpolationLookupOutput = {
  readonly multipliers: readonly number[];
  readonly interpolatedValue: number;
};

/**
 * Interior five-year blocks of the published Beers multiplier tables
 * (Shryock & Siegel, The Methods and Materials of Demography). Each row
 * distributes one single year of a target age group across that group and
 * its two neighbours on each side; every row sums to one fifth.
 */
const BEERS_ORDINARY_G3 = [
  [-0.0117, 0.0804, 0.157, -0.0284, 0.0027],
  [-0.002, 0.016, 0.22, -0.04, 0.006],
  [0.005, -0.028, 0.246, -0.028, 0.005],
  [0.006, -0.04, 0.22, 0.016, -0.002],
  [0.0027, -0.0284, 0.157, 0.0804, -0.0117],
] as const;

const BEERS_MODIFIED_G3 = [
  [-0.016, 0.0973, 0.1321, -0.0121, -0.0013],
  [-0.0129, 0.059, 0.1564, 0.0018, -0.0043],
  [-0.0085, 0.026, 0.165, 0.026, -0.0085],
  [-0.0043, 0.0018, 0.1564, 0.059, -0.0129],
  [-0.0013, -0.0121, 0.1321, 0.0973, -0.016],
] as const;

export const calculateBeersInterpolationLookup = (
  input: BeersInterpolationLookupInput,
): BeersInterpolationLookupOutput => {
  const method = input.method ?? "ordinary";
  if (!(method === "ordinary" || method === "modified"))
    simpleError(
      "method",
      "Choose the ordinary or modified Beers variant.",
      "invalid_method",
    );
  if (input.groupedTotals.length < 5)
    simpleError(
      "groupedTotals",
      "Provide at least five grouped totals so both neighbours exist.",
      "invalid_list",
    );
  for (const value of input.groupedTotals)
    if (!(typeof value === "number" && Number.isFinite(value) && value >= 0))
      simpleError(
        "groupedTotals",
        "Grouped totals must be finite and non-negative.",
        "invalid_list",
      );
  if (!Number.isSafeInteger(input.groupOrdinal))
    simpleError(
      "groupOrdinal",
      "The target group ordinal must be an integer.",
      "invalid_ordinal",
    );
  if (
    input.groupOrdinal < 3 ||
    input.groupOrdinal > input.groupedTotals.length - 2
  )
    simpleError(
      "groupOrdinal",
      "The target group must have two listed groups on each side.",
      "invalid_ordinal",
    );
  if (
    !Number.isSafeInteger(input.ordinalPosition) ||
    input.ordinalPosition < 1 ||
    input.ordinalPosition > 5
  )
    simpleError(
      "ordinalPosition",
      "The single-year position runs from 1 to 5 within the group.",
      "invalid_ordinal",
    );
  const row =
    method === "ordinary"
      ? BEERS_ORDINARY_G3[input.ordinalPosition - 1]!
      : BEERS_MODIFIED_G3[input.ordinalPosition - 1]!;
  const base = input.groupOrdinal - 3;
  let interpolatedValue = 0;
  for (let i = 0; i < 5; i += 1)
    interpolatedValue += row[i]! * input.groupedTotals[base + i]!;
  return { multipliers: [...row], interpolatedValue };
};

export const beersInterpolationLookupExample = {
  input: {
    groupedTotals: [100, 200, 400, 800, 1600],
    groupOrdinal: 3,
    ordinalPosition: 3,
    method: "ordinary",
  },
  output: {
    multipliers: [0.005, -0.028, 0.246, -0.028, 0.005],
    interpolatedValue: 78.9,
  },
} satisfies ToolExample<
  BeersInterpolationLookupInput,
  BeersInterpolationLookupOutput
>;

export const beersInterpolationLookupTool = createSimpleTool({
  id: "demography/beers-interpolation-lookup",
  title: "Beers Interpolation Lookup",
  description:
    "Look up the interior Beers oscillatory interpolation multipliers (ordinary or modified fifth-difference form) for one single year of an age group and apply them to the grouped total and its four neighbouring groups.",
  inputs: [
    {
      description: "Successive five-year group totals.",
      id: "groupedTotals",
      kind: "numberList",
      label: "Grouped totals",
    },
    {
      description:
        "One-based position of the target group among the listed groups; must have two groups on each side.",
      id: "groupOrdinal",
      kind: "integer",
      label: "Target group",
    },
    {
      description:
        "Single year within the target group, from 1 (first year) to 5 (last).",
      id: "ordinalPosition",
      kind: "integer",
      label: "Single year",
    },
    {
      default: "ordinary",
      description: "Beers ordinary or modified multiplier set.",
      enum: ["ordinary", "modified"],
      id: "method",
      kind: "string",
      label: "Method",
    },
  ],
  outputs: [
    {
      description:
        "Five multipliers applied over the target group and its four neighbours.",
      id: "multipliers",
      kind: "numberList",
      label: "Multipliers",
    },
    {
      description:
        "Interpolated single-year value obtained from the multipliers.",
      id: "interpolatedValue",
      kind: "number",
      label: "Interpolated value",
    },
  ],
  calculate: (input) =>
    calculateBeersInterpolationLookup(
      input as unknown as BeersInterpolationLookupInput,
    ),
});

export const runBeersInterpolationLookup = beersInterpolationLookupTool.execute;
export default beersInterpolationLookupTool;
