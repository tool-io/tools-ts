import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerIndependentConcreteShearN: number;
  readonly stirrupAreaM2: number;
  readonly callerStirrupYieldPa: number;
  readonly effectiveDepthM: number;
  readonly stirrupSpacingM: number;
  readonly callerStrengthReductionFactor: number;
}>;
export type Output = Readonly<{ readonly callerFactoredRcShearN: number }>;
const inputFields = [
  {
    id: "callerIndependentConcreteShearN",
    label: "Caller independent concrete shear n",
    kind: "number",
  },
  { id: "stirrupAreaM2", label: "Stirrup area m2", kind: "number" },
  {
    id: "callerStirrupYieldPa",
    label: "Caller stirrup yield pa",
    kind: "number",
  },
  { id: "effectiveDepthM", label: "Effective depth m", kind: "number" },
  { id: "stirrupSpacingM", label: "Stirrup spacing m", kind: "number" },
  {
    id: "callerStrengthReductionFactor",
    label: "Caller strength reduction factor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.stirrupSpacingM, "stirrupSpacingM");
  positive(input.callerStirrupYieldPa, "callerStirrupYieldPa");
  positive(input.effectiveDepthM, "effectiveDepthM");
  nonnegative(
    input.callerIndependentConcreteShearN,
    "callerIndependentConcreteShearN",
  );
  nonnegative(input.stirrupAreaM2, "stirrupAreaM2");
  fraction(
    input.callerStrengthReductionFactor,
    "callerStrengthReductionFactor",
  );
  return {
    callerFactoredRcShearN:
      input.callerStrengthReductionFactor *
      (input.callerIndependentConcreteShearN +
        (input.stirrupAreaM2 *
          input.callerStirrupYieldPa *
          input.effectiveDepthM) /
          input.stirrupSpacingM),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerIndependentConcreteShearN: 10,
  stirrupAreaM2: 0.1,
  callerStirrupYieldPa: 100,
  effectiveDepthM: 2,
  stirrupSpacingM: 0.5,
  callerStrengthReductionFactor: 0.8,
} satisfies Input;
export const exampleOutput = { callerFactoredRcShearN: 40 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/rc-shear-capacity",
  title: "RC Shear Capacity Calculator",
  description:
    "Separate independent concrete contribution plus vertical stirrup Av fy d/s, caller edition/reduction applicability independently established. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerFactoredRcShearN",
      label: "Caller factored rc shear n",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerIndependentConcreteShearN:
        value.callerIndependentConcreteShearN as number,
      stirrupAreaM2: value.stirrupAreaM2 as number,
      callerStirrupYieldPa: value.callerStirrupYieldPa as number,
      effectiveDepthM: value.effectiveDepthM as number,
      stirrupSpacingM: value.stirrupSpacingM as number,
      callerStrengthReductionFactor:
        value.callerStrengthReductionFactor as number,
    }),
});
export const run = tool.execute;
export default tool;
