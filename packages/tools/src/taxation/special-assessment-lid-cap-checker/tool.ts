import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, money, signedSum } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedSpecialAssessmentLidMinor: number;
  readonly callerVerifiedSpecialAssessmentLidThresholdMinor: number;
}>;
export type Output = Readonly<{
  readonly signedThresholdExcessMinor: number;
  readonly callerThresholdReached: boolean;
}>;
const inputFields = [
  {
    id: "observedSpecialAssessmentLidMinor",
    label: "Observed special assessment lid minor",
    kind: "number",
  },
  {
    id: "callerVerifiedSpecialAssessmentLidThresholdMinor",
    label: "Caller verified special assessment lid threshold minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(
    input.observedSpecialAssessmentLidMinor,
    "observedSpecialAssessmentLidMinor",
  );
  money(
    input.callerVerifiedSpecialAssessmentLidThresholdMinor,
    "callerVerifiedSpecialAssessmentLidThresholdMinor",
  );
  return {
    signedThresholdExcessMinor: signedSum([
      input.observedSpecialAssessmentLidMinor,
      -input.callerVerifiedSpecialAssessmentLidThresholdMinor,
    ]),
    callerThresholdReached:
      input.observedSpecialAssessmentLidMinor >=
      input.callerVerifiedSpecialAssessmentLidThresholdMinor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSpecialAssessmentLidMinor: 120,
  callerVerifiedSpecialAssessmentLidThresholdMinor: 100,
} satisfies Input;
export const exampleOutput = {
  signedThresholdExcessMinor: 20,
  callerThresholdReached: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/special-assessment-lid-cap-checker",
  title: "Special Assessment Lid Cap Checker",
  description:
    "Caller independently eligible special-assessment amount against applicable lid cap. Integer minor units one caller currency, explicit inclusive threshold. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedThresholdExcessMinor",
      label: "Signed threshold excess minor",
      kind: "number",
    },
    {
      id: "callerThresholdReached",
      label: "Caller threshold reached",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSpecialAssessmentLidMinor:
        value.observedSpecialAssessmentLidMinor as number,
      callerVerifiedSpecialAssessmentLidThresholdMinor:
        value.callerVerifiedSpecialAssessmentLidThresholdMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
