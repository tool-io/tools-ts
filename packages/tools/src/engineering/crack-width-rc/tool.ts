import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerMatchedMeanCrackSpacingM: number;
  readonly observedMeanSteelStrain: number;
  readonly callerIndependentConcreteBetweenCracksStrain: number;
}>;
export type Output = Readonly<{ readonly signedRcCrackWidthM: number }>;
const inputFields = [
  {
    id: "callerMatchedMeanCrackSpacingM",
    label: "Caller matched mean crack spacing m",
    kind: "number",
  },
  {
    id: "observedMeanSteelStrain",
    label: "Observed mean steel strain",
    kind: "number",
  },
  {
    id: "callerIndependentConcreteBetweenCracksStrain",
    label: "Caller independent concrete between cracks strain",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerMatchedMeanCrackSpacingM,
    "callerMatchedMeanCrackSpacingM",
  );
  return {
    signedRcCrackWidthM:
      input.callerMatchedMeanCrackSpacingM *
      (input.observedMeanSteelStrain -
        input.callerIndependentConcreteBetweenCracksStrain),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerMatchedMeanCrackSpacingM: 0.2,
  observedMeanSteelStrain: 0.001,
  callerIndependentConcreteBetweenCracksStrain: 0.0002,
} satisfies Input;
export const exampleOutput = { signedRcCrackWidthM: 0.00016 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/crack-width-rc",
  title: "RC Crack Width Calculator",
  description:
    "Crack-spacing×independently established mean steel/concrete strain contrast; negative closure retained, no universal crack-spacing/code limit. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedRcCrackWidthM",
      label: "Signed rc crack width m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerMatchedMeanCrackSpacingM:
        value.callerMatchedMeanCrackSpacingM as number,
      observedMeanSteelStrain: value.observedMeanSteelStrain as number,
      callerIndependentConcreteBetweenCracksStrain:
        value.callerIndependentConcreteBetweenCracksStrain as number,
    }),
});
export const run = tool.execute;
export default tool;
