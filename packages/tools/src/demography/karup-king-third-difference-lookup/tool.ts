import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type KarupKingThirdDifferenceLookupInput = {
  readonly groupedTotals: readonly number[];
  readonly groupOrdinal: number;
  readonly ordinalPosition: number;
};

export type KarupKingThirdDifferenceLookupOutput = {
  readonly multipliers: readonly number[];
  readonly interpolatedValue: number;
};

/**
 * Interior Karup-King third-difference separation factors (Shryock & Siegel,
 * The Methods and Materials of Demography). Each row splits one single year
 * of the target group over that group and its immediate neighbours; every
 * row sums to one fifth and the five rows together reproduce the group.
 */
const KARUP_KING_FACTORS = [
  [0.064, 0.152, -0.016],
  [0.008, 0.224, -0.032],
  [-0.024, 0.248, -0.024],
  [-0.032, 0.224, 0.008],
  [-0.016, 0.152, 0.064],
] as const;

export const calculateKarupKingThirdDifferenceLookup = (
  input: KarupKingThirdDifferenceLookupInput,
): KarupKingThirdDifferenceLookupOutput => {
  if (input.groupedTotals.length < 3)
    simpleError(
      "groupedTotals",
      "Provide at least three grouped totals so both neighbours exist.",
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
    input.groupOrdinal < 2 ||
    input.groupOrdinal > input.groupedTotals.length - 1
  )
    simpleError(
      "groupOrdinal",
      "The target group must have one listed group on each side.",
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
  const row = KARUP_KING_FACTORS[input.ordinalPosition - 1]!;
  const base = input.groupOrdinal - 2;
  let interpolatedValue = 0;
  for (let i = 0; i < 3; i += 1)
    interpolatedValue += row[i]! * input.groupedTotals[base + i]!;
  return { multipliers: [...row], interpolatedValue };
};

export const karupKingThirdDifferenceLookupExample = {
  input: {
    groupedTotals: [100, 200, 400, 800, 1600],
    groupOrdinal: 3,
    ordinalPosition: 3,
  },
  output: {
    multipliers: [-0.024, 0.248, -0.024],
    interpolatedValue: 75.2,
  },
} satisfies ToolExample<
  KarupKingThirdDifferenceLookupInput,
  KarupKingThirdDifferenceLookupOutput
>;

export const karupKingThirdDifferenceLookupTool = createSimpleTool({
  id: "demography/karup-king-third-difference-lookup",
  title: "Karup King Third Difference Lookup",
  description:
    "Look up the Karup-King third-difference interpolation factors for one single year of an age group and apply them to the grouped total with its two immediate neighbouring groups.",
  inputs: [
    {
      description: "Successive five-year group totals.",
      id: "groupedTotals",
      kind: "numberList",
      label: "Grouped totals",
    },
    {
      description:
        "One-based position of the target group among the listed groups; must have one group on each side.",
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
  ],
  outputs: [
    {
      description:
        "Three multipliers applied over the target group and its neighbours.",
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
    calculateKarupKingThirdDifferenceLookup(
      input as unknown as KarupKingThirdDifferenceLookupInput,
    ),
});

export const runKarupKingThirdDifferenceLookup =
  karupKingThirdDifferenceLookupTool.execute;
export default karupKingThirdDifferenceLookupTool;
