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
  readonly callerRestrainedShrinkageFraction: number;
  readonly callerEffectiveConcreteModulusPa: number;
  readonly callerIndependentRelaxationRetentionFraction: number;
  readonly callerVerifiedTensileThresholdPa: number;
}>;
export type Output = Readonly<{
  readonly signedShrinkageTensionThresholdMarginPa: number;
}>;
const inputFields = [
  {
    id: "callerRestrainedShrinkageFraction",
    label: "Caller restrained shrinkage fraction",
    kind: "number",
  },
  {
    id: "callerEffectiveConcreteModulusPa",
    label: "Caller effective concrete modulus pa",
    kind: "number",
  },
  {
    id: "callerIndependentRelaxationRetentionFraction",
    label: "Caller independent relaxation retention fraction",
    kind: "number",
  },
  {
    id: "callerVerifiedTensileThresholdPa",
    label: "Caller verified tensile threshold pa",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerEffectiveConcreteModulusPa,
    "callerEffectiveConcreteModulusPa",
  );
  nonnegative(
    input.callerRestrainedShrinkageFraction,
    "callerRestrainedShrinkageFraction",
  );
  nonnegative(
    input.callerVerifiedTensileThresholdPa,
    "callerVerifiedTensileThresholdPa",
  );
  fraction(
    input.callerIndependentRelaxationRetentionFraction,
    "callerIndependentRelaxationRetentionFraction",
  );
  return {
    signedShrinkageTensionThresholdMarginPa:
      input.callerVerifiedTensileThresholdPa -
      input.callerRestrainedShrinkageFraction *
        input.callerEffectiveConcreteModulusPa *
        input.callerIndependentRelaxationRetentionFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerRestrainedShrinkageFraction: 0.001,
  callerEffectiveConcreteModulusPa: 10000,
  callerIndependentRelaxationRetentionFraction: 0.5,
  callerVerifiedTensileThresholdPa: 4,
} satisfies Input;
export const exampleOutput = {
  signedShrinkageTensionThresholdMarginPa: -1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/concrete-shrinkage-crack-control",
  title: "Concrete Shrinkage Crack Control Calculator",
  description:
    "Restrained shrinkage nominal tension after independent relaxation compared with independently established tensile threshold, not crack count or control design. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedShrinkageTensionThresholdMarginPa",
      label: "Signed shrinkage tension threshold margin pa",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerRestrainedShrinkageFraction:
        value.callerRestrainedShrinkageFraction as number,
      callerEffectiveConcreteModulusPa:
        value.callerEffectiveConcreteModulusPa as number,
      callerIndependentRelaxationRetentionFraction:
        value.callerIndependentRelaxationRetentionFraction as number,
      callerVerifiedTensileThresholdPa:
        value.callerVerifiedTensileThresholdPa as number,
    }),
});
export const run = tool.execute;
export default tool;
