import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyEstablishedCriticalBedShearPa: number;
  readonly observedLiquidDensityKgM3: number;
  readonly callerDarcyFrictionFactor: number;
}>;
export type Output = Readonly<{
  readonly shearCriterionMeanVelocityMSecond: number;
}>;
const inputFields = [
  {
    id: "callerIndependentlyEstablishedCriticalBedShearPa",
    label: "Caller independently established critical bed shear pa",
    kind: "number",
  },
  {
    id: "observedLiquidDensityKgM3",
    label: "Observed liquid density kg m3",
    kind: "number",
  },
  {
    id: "callerDarcyFrictionFactor",
    label: "Caller darcy friction factor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedLiquidDensityKgM3, "observedLiquidDensityKgM3");
  positive(input.callerDarcyFrictionFactor, "callerDarcyFrictionFactor");
  nonnegative(
    input.callerIndependentlyEstablishedCriticalBedShearPa,
    "callerIndependentlyEstablishedCriticalBedShearPa",
  );
  return {
    shearCriterionMeanVelocityMSecond: Math.sqrt(
      (8 * input.callerIndependentlyEstablishedCriticalBedShearPa) /
        (input.observedLiquidDensityKgM3 * input.callerDarcyFrictionFactor),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerIndependentlyEstablishedCriticalBedShearPa: 10,
  observedLiquidDensityKgM3: 1000,
  callerDarcyFrictionFactor: 0.02,
} satisfies Input;
export const exampleOutput = {
  shearCriterionMeanVelocityMSecond: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/sewer-self-cleansing-velocity",
  title: "Sewer Self-Cleansing Velocity Calculator",
  description:
    "Invert independently calibrated bed shear criterion using Darcy τ=fρv²/8, not Manning flow or universal self-cleansing sediment threshold. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "shearCriterionMeanVelocityMSecond",
      label: "Shear criterion mean velocity m second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerIndependentlyEstablishedCriticalBedShearPa:
        value.callerIndependentlyEstablishedCriticalBedShearPa as number,
      observedLiquidDensityKgM3: value.observedLiquidDensityKgM3 as number,
      callerDarcyFrictionFactor: value.callerDarcyFrictionFactor as number,
    }),
});
export const run = tool.execute;
export default tool;
