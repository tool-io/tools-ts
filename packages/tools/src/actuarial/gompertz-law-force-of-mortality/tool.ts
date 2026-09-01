import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  finite,
} from "../batch45-shared.js";
export type Input = Readonly<{
  readonly callerCalibratedBaselineForcePerYear: number;
  readonly callerCalibratedAnnualGrowthFactor: number;
  readonly ageYears: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerCalibratedBaselineForcePerYear",
    label: "Caller calibrated baseline force per year",
    kind: "number",
  },
  {
    id: "callerCalibratedAnnualGrowthFactor",
    label: "Caller calibrated annual growth factor",
    kind: "number",
  },
  { id: "ageYears", label: "Age years", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.callerCalibratedBaselineForcePerYear, "baseline");
  if (input.callerCalibratedAnnualGrowthFactor <= 1)
    simpleError(
      "growth",
      "Gompertz increasing-force convention requires growth factor>1.",
    );
  if (input.ageYears < 0 || input.ageYears > 150)
    simpleError("age", "Conditional age0–150 years.");
  const l = Math.log(input.callerCalibratedAnnualGrowthFactor),
    mu = finite(
      Math.exp(
        Math.log(input.callerCalibratedBaselineForcePerYear) +
          input.ageYears * l,
      ),
    ),
    h = finite((mu * Math.expm1(l)) / l);
  return {
    conditionalForcePerYear: mu,
    forceDoublingAgeIntervalYears: Math.log(2) / l,
    conditionalIntegratedNextYearHazard: h,
    conditionalNextYearSurvival: Math.exp(-h),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerCalibratedBaselineForcePerYear: 0.001,
    callerCalibratedAnnualGrowthFactor: 2,
    ageYears: 3,
  },
  output: {
    result: {
      conditionalForcePerYear: 0.008,
      forceDoublingAgeIntervalYears: 1,
      conditionalIntegratedNextYearHazard: 0.011541560327111709,
      conditionalNextYearSurvival: 0.9885247879806346,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "actuarial/gompertz-law-force-of-mortality",
  title: "Gompertz Law Force of Mortality Calculator",
  description:
    "Conditional Gompertz law \u03bc(x)=B c^x for independently calibrated B>0, c>1, in inverse years, with integrated next-year hazard and exp(\u2212hazard) survival. These are explicit actuarial model assumptions, not observed individual death probability, diagnosis, life expectancy, clinical advice or a published mortality table.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
