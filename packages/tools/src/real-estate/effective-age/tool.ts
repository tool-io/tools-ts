import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EffectiveAgeInput = Readonly<{
  readonly accumulatedDepreciation: number;
  readonly replacementCost: number;
  readonly economicLifeYears: number;
}>;
export type EffectiveAgeOutput = Readonly<{
  readonly effectiveAgeYears: number;
}>;

export const calculateEffectiveAge = (
  x: EffectiveAgeInput,
): EffectiveAgeOutput => {
  if (
    !Number.isFinite(x.accumulatedDepreciation) ||
    x.accumulatedDepreciation < 0
  )
    simpleError(
      "accumulatedDepreciation",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.replacementCost) || x.replacementCost <= 0)
    simpleError("replacementCost", "Provide a finite positive number.");
  if (!Number.isFinite(x.economicLifeYears) || x.economicLifeYears <= 0)
    simpleError("economicLifeYears", "Provide a finite positive number.");
  if (!(x.accumulatedDepreciation <= x.replacementCost))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const effectiveAgeYears =
    (x.accumulatedDepreciation / x.replacementCost) * x.economicLifeYears;
  if (!Number.isFinite(effectiveAgeYears))
    simpleError(
      "effectiveAgeYears",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    effectiveAgeYears: Object.is(effectiveAgeYears, -0) ? 0 : effectiveAgeYears,
  };
};

export const example = {
  input: {
    accumulatedDepreciation: 20000,
    replacementCost: 100000,
    economicLifeYears: 50,
  },
  output: { effectiveAgeYears: 10 },
} satisfies ToolExample<EffectiveAgeInput, EffectiveAgeOutput>;

export const tool = createSimpleTool({
  id: "real-estate/effective-age",
  title: "Effective Age",
  description:
    "Simple effective age estimate from replacement cost and accumulated depreciation; assumes straight-line economic life.",
  inputs: [
    {
      id: "accumulatedDepreciation",
      kind: "number",
      label: "Accumulated Depreciation",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "replacementCost",
      kind: "number",
      label: "Replacement Cost",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "economicLifeYears",
      kind: "number",
      label: "Economic Life Years",
      unit: "year",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "effectiveAgeYears",
      kind: "number",
      label: "Effective Age Years",
      unit: "year",
    },
  ],
  calculate: (input) =>
    calculateEffectiveAge({
      accumulatedDepreciation: input.accumulatedDepreciation as number,
      replacementCost: input.replacementCost as number,
      economicLifeYears: input.economicLifeYears as number,
    }),
});
export const effectiveAgeTool = tool;
export const runEffectiveAge = tool.execute;
export default tool;
