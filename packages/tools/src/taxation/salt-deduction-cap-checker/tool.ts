import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, money, signedSum } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedSaltEligibleDeductionMinor: number;
  readonly callerVerifiedSaltEligibleDeductionThresholdMinor: number;
}>;
export type Output = Readonly<{
  readonly signedThresholdExcessMinor: number;
  readonly callerThresholdReached: boolean;
}>;
const inputFields = [
  {
    id: "observedSaltEligibleDeductionMinor",
    label: "Observed salt eligible deduction minor",
    kind: "number",
  },
  {
    id: "callerVerifiedSaltEligibleDeductionThresholdMinor",
    label: "Caller verified salt eligible deduction threshold minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(
    input.observedSaltEligibleDeductionMinor,
    "observedSaltEligibleDeductionMinor",
  );
  money(
    input.callerVerifiedSaltEligibleDeductionThresholdMinor,
    "callerVerifiedSaltEligibleDeductionThresholdMinor",
  );
  return {
    signedThresholdExcessMinor: signedSum([
      input.observedSaltEligibleDeductionMinor,
      -input.callerVerifiedSaltEligibleDeductionThresholdMinor,
    ]),
    callerThresholdReached:
      input.observedSaltEligibleDeductionMinor >=
      input.callerVerifiedSaltEligibleDeductionThresholdMinor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSaltEligibleDeductionMinor: 120,
  callerVerifiedSaltEligibleDeductionThresholdMinor: 100,
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
  id: "taxation/salt-deduction-cap-checker",
  title: "SALT Deduction Cap Checker",
  description:
    "SALT independently eligible deduction sum vs caller year/status cap, not all property payments eligible. Integer minor units one caller currency, explicit inclusive threshold. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      observedSaltEligibleDeductionMinor:
        value.observedSaltEligibleDeductionMinor as number,
      callerVerifiedSaltEligibleDeductionThresholdMinor:
        value.callerVerifiedSaltEligibleDeductionThresholdMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
