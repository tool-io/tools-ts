import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SpragueMultipliersOsculatoryLookupInput = {
  readonly groupedTotals: readonly number[];
  readonly groupOrdinal: number;
  readonly ordinalPosition: number;
};

export type SpragueMultipliersOsculatoryLookupOutput = {
  readonly multipliers: readonly number[];
  readonly interpolatedValue: number;
};

/**
 * Interior five-year block of the Sprague osculatory multipliers
 * (Sprague 1880; Siegel & Swanson, The Methods and Materials of Demography).
 * Each row spreads one fifth of the target group over its five single years
 * using the group and its two neighbours on each side.
 */
const SPRAGUE_G3 = [
  [-0.0128, 0.0848, 0.1504, -0.024, 0.0016],
  [-0.0016, 0.0144, 0.2224, -0.0416, 0.0064],
  [0.0064, -0.0336, 0.2544, -0.0336, 0.0064],
  [0.0064, -0.0416, 0.2224, 0.0144, -0.0016],
  [0.0016, -0.024, 0.1504, 0.0848, -0.0128],
] as const;

export const calculateSpragueMultipliersOsculatoryLookup = (
  input: SpragueMultipliersOsculatoryLookupInput,
): SpragueMultipliersOsculatoryLookupOutput => {
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
  const row = SPRAGUE_G3[input.ordinalPosition - 1]!;
  const base = input.groupOrdinal - 3;
  let interpolatedValue = 0;
  for (let i = 0; i < 5; i += 1)
    interpolatedValue += row[i]! * input.groupedTotals[base + i]!;
  return { multipliers: [...row], interpolatedValue };
};

export const spragueMultipliersOsculatoryLookupExample = {
  input: {
    groupedTotals: [100, 200, 400, 800, 1600],
    groupOrdinal: 3,
    ordinalPosition: 3,
  },
  output: {
    multipliers: [0.0064, -0.0336, 0.2544, -0.0336, 0.0064],
    interpolatedValue: 79.04,
  },
} satisfies ToolExample<
  SpragueMultipliersOsculatoryLookupInput,
  SpragueMultipliersOsculatoryLookupOutput
>;

export const spragueMultipliersOsculatoryLookupTool = createSimpleTool({
  id: "demography/sprague-multipliers-osculatory-lookup",
  title: "Sprague Multipliers Osculatory Lookup",
  description:
    "Look up the Sprague fifth-order osculatory interpolation multipliers for one single year of an age group and apply them to the grouped total and its four neighbouring groups.",
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
    calculateSpragueMultipliersOsculatoryLookup(
      input as unknown as SpragueMultipliersOsculatoryLookupInput,
    ),
});

export const runSpragueMultipliersOsculatoryLookup =
  spragueMultipliersOsculatoryLookupTool.execute;
export default spragueMultipliersOsculatoryLookupTool;
