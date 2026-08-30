import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ThreeHorizonsInput = {
  readonly itemYears: ReadonlyArray<number>;
  readonly secondHorizonStart: number;
  readonly thirdHorizonStart: number;
};

export type ThreeHorizonsOutput = {
  readonly assignments: ReadonlyArray<string>;
  readonly horizonCounts: ReadonlyArray<number>;
};

export const mapThreeHorizonItems = (
  input: ThreeHorizonsInput,
): ThreeHorizonsOutput => {
  for (const [field, value] of [
    ["secondHorizonStart", input.secondHorizonStart],
    ["thirdHorizonStart", input.thirdHorizonStart],
  ] as const)
    if (!Number.isFinite(value))
      simpleError(
        field,
        `${field} must be finite.`,
        "invalid_horizon_boundary",
      );
  if (input.secondHorizonStart >= input.thirdHorizonStart)
    simpleError(
      "thirdHorizonStart",
      "Third-horizon start must follow second-horizon start.",
      "invalid_horizon_boundaries",
    );
  if (!Array.isArray(input.itemYears))
    simpleError(
      "itemYears",
      "Item years must be an array.",
      "item_years_required",
    );
  const assignments: string[] = [];
  const horizonCounts = [0, 0, 0];
  for (const [index, year] of input.itemYears.entries()) {
    if (!Number.isFinite(year))
      simpleError(
        `itemYears.${index}`,
        "Item years must be finite.",
        "invalid_item_year",
      );
    const horizon =
      year < input.secondHorizonStart
        ? 0
        : year < input.thirdHorizonStart
          ? 1
          : 2;
    horizonCounts[horizon] += 1;
    assignments.push(`item_${index}: H${horizon + 1}`);
  }
  return { assignments, horizonCounts };
};

export const threeHorizonsExample = {
  input: {
    itemYears: [2026, 2031, 2041],
    secondHorizonStart: 2030,
    thirdHorizonStart: 2040,
  },
  output: {
    assignments: ["item_0: H1", "item_1: H2", "item_2: H3"],
    horizonCounts: [1, 1, 1],
  },
} satisfies ToolExample<ThreeHorizonsInput, ThreeHorizonsOutput>;

export const threeHorizonsTool = createSimpleTool({
  calculate: (input) =>
    mapThreeHorizonItems({
      itemYears: input.itemYears as number[],
      secondHorizonStart: input.secondHorizonStart as number,
      thirdHorizonStart: input.thirdHorizonStart as number,
    }),
  description:
    "Map item years to three horizons using caller-supplied second- and third-horizon boundary years.",
  id: "futurology/three-horizons-framework-transition-map-lookup",
  inputs: [
    { id: "itemYears", kind: "numberList", label: "Item years" },
    { id: "secondHorizonStart", kind: "number", label: "Second-horizon start" },
    { id: "thirdHorizonStart", kind: "number", label: "Third-horizon start" },
  ],
  outputs: [
    { id: "assignments", kind: "stringList", label: "Horizon assignments" },
    { id: "horizonCounts", kind: "numberList", label: "Horizon counts" },
  ],
  title: "Three Horizons Framework Transition Map Lookup",
});

export const runThreeHorizons = threeHorizonsTool.execute;
export default threeHorizonsTool;
