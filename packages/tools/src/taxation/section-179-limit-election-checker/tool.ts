import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, money, signedSum } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedSection179ElectionMinor: number;
  readonly callerVerifiedSection179ElectionThresholdMinor: number;
}>;
export type Output = Readonly<{
  readonly signedThresholdExcessMinor: number;
  readonly callerThresholdReached: boolean;
}>;
const inputFields = [
  {
    id: "observedSection179ElectionMinor",
    label: "Observed section 179 election minor",
    kind: "number",
  },
  {
    id: "callerVerifiedSection179ElectionThresholdMinor",
    label: "Caller verified section 179 election threshold minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(
    input.observedSection179ElectionMinor,
    "observedSection179ElectionMinor",
  );
  money(
    input.callerVerifiedSection179ElectionThresholdMinor,
    "callerVerifiedSection179ElectionThresholdMinor",
  );
  return {
    signedThresholdExcessMinor: signedSum([
      input.observedSection179ElectionMinor,
      -input.callerVerifiedSection179ElectionThresholdMinor,
    ]),
    callerThresholdReached:
      input.observedSection179ElectionMinor >=
      input.callerVerifiedSection179ElectionThresholdMinor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSection179ElectionMinor: 120,
  callerVerifiedSection179ElectionThresholdMinor: 100,
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
  id: "taxation/section-179-limit-election-checker",
  title: "Section 179 Limit Election Checker",
  description:
    "Section 179 eligible election vs caller applicable cap, not phaseout/taxable-income restrictions inferred. Integer minor units one caller currency, explicit inclusive threshold. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      observedSection179ElectionMinor:
        value.observedSection179ElectionMinor as number,
      callerVerifiedSection179ElectionThresholdMinor:
        value.callerVerifiedSection179ElectionThresholdMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
