import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VonBertalanffyGrowthInput = Readonly<{
  readonly asymptoticLengthCentimeters: number;
  readonly growthCoefficientPerYear: number;
  readonly ageYears: number;
  readonly theoreticalAgeYears: number;
}>;
export type VonBertalanffyGrowthOutput = Readonly<{
  readonly predictedLengthCentimeters: number;
}>;

export const calculateVonBertalanffyGrowth = (
  x: VonBertalanffyGrowthInput,
): VonBertalanffyGrowthOutput => {
  if (
    !Number.isFinite(x.asymptoticLengthCentimeters) ||
    x.asymptoticLengthCentimeters < 0
  )
    simpleError(
      "asymptoticLengthCentimeters",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.growthCoefficientPerYear) ||
    x.growthCoefficientPerYear < 0
  )
    simpleError(
      "growthCoefficientPerYear",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.ageYears) || x.ageYears < 0)
    simpleError("ageYears", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.theoreticalAgeYears))
    simpleError("theoreticalAgeYears", "Provide a finite number.");
  if (x.ageYears < x.theoreticalAgeYears || x.asymptoticLengthCentimeters <= 0)
    simpleError(
      "ageYears",
      "Age must be at least theoretical age and asymptotic length positive.",
    );
  const predictedLengthCentimeters =
    x.asymptoticLengthCentimeters *
    (1 -
      Math.exp(
        -x.growthCoefficientPerYear * (x.ageYears - x.theoreticalAgeYears),
      ));
  if (!Number.isFinite(predictedLengthCentimeters))
    simpleError(
      "predictedLengthCentimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    predictedLengthCentimeters: Object.is(predictedLengthCentimeters, -0)
      ? 0
      : predictedLengthCentimeters,
  };
};

export const example = {
  input: {
    asymptoticLengthCentimeters: 100,
    growthCoefficientPerYear: 0.2,
    ageYears: 5,
    theoreticalAgeYears: 0,
  },
  output: { predictedLengthCentimeters: 63.212055882855765 },
} satisfies ToolExample<VonBertalanffyGrowthInput, VonBertalanffyGrowthOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/von-bertalanffy-growth",
  title: "Von Bertalanffy Growth",
  description:
    "Evaluate a supplied von Bertalanffy length-growth curve; its fitted parameters are species- and population-specific.",
  inputs: [
    {
      id: "asymptoticLengthCentimeters",
      kind: "number",
      label: "Asymptotic Length Centimeters",
      unit: "cm",
    },
    {
      id: "growthCoefficientPerYear",
      kind: "number",
      label: "Growth Coefficient Per Year",
      unit: "1/year",
    },
    { id: "ageYears", kind: "number", label: "Age Years", unit: "years" },
    {
      id: "theoreticalAgeYears",
      kind: "number",
      label: "Theoretical Age Years",
      unit: "years",
    },
  ],
  outputs: [
    {
      id: "predictedLengthCentimeters",
      kind: "number",
      label: "Predicted Length Centimeters",
      unit: "cm",
    },
  ],
  calculate: (input) =>
    calculateVonBertalanffyGrowth({
      asymptoticLengthCentimeters: input.asymptoticLengthCentimeters as number,
      growthCoefficientPerYear: input.growthCoefficientPerYear as number,
      ageYears: input.ageYears as number,
      theoreticalAgeYears: input.theoreticalAgeYears as number,
    }),
});
export const runVonBertalanffyGrowth = tool.execute;
export default tool;
