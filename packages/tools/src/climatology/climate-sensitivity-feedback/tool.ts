import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, sum } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerPlanckRestoringWPerM2K: number;
  readonly callerSignedAmplifyingFeedbackComponentsWPerM2K: readonly number[];
}>;
export type Output = Readonly<{
  readonly netRestoringFeedbackWPerM2K: number;
  readonly conditionalSensitivityKelvinPerWPerM2: number;
}>;
const inputFields = [
  {
    id: "callerPlanckRestoringWPerM2K",
    label: "Caller planck restoring w per m2 k",
    kind: "number",
  },
  {
    id: "callerSignedAmplifyingFeedbackComponentsWPerM2K",
    label: "Caller signed amplifying feedback components w per m2 k",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerPlanckRestoringWPerM2K, "callerPlanckRestoringWPerM2K");
  positive(
    input.callerPlanckRestoringWPerM2K -
      sum(input.callerSignedAmplifyingFeedbackComponentsWPerM2K),
    "stable restoring feedback",
  );
  return {
    netRestoringFeedbackWPerM2K:
      input.callerPlanckRestoringWPerM2K -
      sum(input.callerSignedAmplifyingFeedbackComponentsWPerM2K),
    conditionalSensitivityKelvinPerWPerM2:
      1 /
      (input.callerPlanckRestoringWPerM2K -
        sum(input.callerSignedAmplifyingFeedbackComponentsWPerM2K)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerPlanckRestoringWPerM2K: 3,
  callerSignedAmplifyingFeedbackComponentsWPerM2K: [0.5, 1],
} satisfies Input;
export const exampleOutput = {
  netRestoringFeedbackWPerM2K: 1.5,
  conditionalSensitivityKelvinPerWPerM2: 0.6666666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/climate-sensitivity-feedback",
  title: "Climate Sensitivity Feedback Parameter Calculator",
  description:
    "Subtract signed amplifying feedback components from an independently specified positive Planck restoring response, then compute 1/net sensitivity. Requires stable positive net restoring feedback. Components are not inferred from warming; this is not a validated climate forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "netRestoringFeedbackWPerM2K",
      label: "Net restoring feedback w per m2 k",
      kind: "number",
    },
    {
      id: "conditionalSensitivityKelvinPerWPerM2",
      label: "Conditional sensitivity kelvin per w per m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerPlanckRestoringWPerM2K:
        value.callerPlanckRestoringWPerM2K as number,
      callerSignedAmplifyingFeedbackComponentsWPerM2K:
        value.callerSignedAmplifyingFeedbackComponentsWPerM2K as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
