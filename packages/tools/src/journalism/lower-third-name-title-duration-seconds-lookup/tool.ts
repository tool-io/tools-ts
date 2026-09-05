import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  ordered,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedLowerThirdHoldSeconds: number;
  readonly callerVerifiedMinimumHoldSeconds: number;
  readonly callerVerifiedMaximumHoldSeconds: number;
}>;
export type Output = Readonly<{
  readonly signedCallerHoldDurationMarginSeconds: number;
}>;
const inputFields = [
  {
    id: "observedLowerThirdHoldSeconds",
    label: "Observed lower third hold seconds",
    kind: "number",
  },
  {
    id: "callerVerifiedMinimumHoldSeconds",
    label: "Caller verified minimum hold seconds",
    kind: "number",
  },
  {
    id: "callerVerifiedMaximumHoldSeconds",
    label: "Caller verified maximum hold seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.observedLowerThirdHoldSeconds,
    "observedLowerThirdHoldSeconds",
  );
  nonnegative(
    input.callerVerifiedMinimumHoldSeconds,
    "callerVerifiedMinimumHoldSeconds",
  );
  nonnegative(
    input.callerVerifiedMaximumHoldSeconds,
    "callerVerifiedMaximumHoldSeconds",
  );
  ordered(
    input.callerVerifiedMinimumHoldSeconds,
    input.callerVerifiedMaximumHoldSeconds,
  );
  return {
    signedCallerHoldDurationMarginSeconds: Math.min(
      input.observedLowerThirdHoldSeconds -
        input.callerVerifiedMinimumHoldSeconds,
      input.callerVerifiedMaximumHoldSeconds -
        input.observedLowerThirdHoldSeconds,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLowerThirdHoldSeconds: 4,
  callerVerifiedMinimumHoldSeconds: 3,
  callerVerifiedMaximumHoldSeconds: 6,
} satisfies Input;
export const exampleOutput = {
  signedCallerHoldDurationMarginSeconds: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/lower-third-name-title-duration-seconds-lookup",
  title: "Lower Third Name Title Duration Seconds Lookup",
  description:
    "Actual lower-third display-duration screen against independently verified readable house bands, not existing line-length fit or a fixed universal duration. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedCallerHoldDurationMarginSeconds",
      label: "Signed caller hold duration margin seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLowerThirdHoldSeconds:
        value.observedLowerThirdHoldSeconds as number,
      callerVerifiedMinimumHoldSeconds:
        value.callerVerifiedMinimumHoldSeconds as number,
      callerVerifiedMaximumHoldSeconds:
        value.callerVerifiedMaximumHoldSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
