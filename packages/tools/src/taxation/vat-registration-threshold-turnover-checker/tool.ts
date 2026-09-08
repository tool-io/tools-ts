import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, money, signedSum } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedVatRegistrationTurnoverMinor: number;
  readonly callerVerifiedVatRegistrationTurnoverThresholdMinor: number;
}>;
export type Output = Readonly<{
  readonly signedThresholdExcessMinor: number;
  readonly callerThresholdReached: boolean;
}>;
const inputFields = [
  {
    id: "observedVatRegistrationTurnoverMinor",
    label: "Observed vat registration turnover minor",
    kind: "number",
  },
  {
    id: "callerVerifiedVatRegistrationTurnoverThresholdMinor",
    label: "Caller verified vat registration turnover threshold minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(
    input.observedVatRegistrationTurnoverMinor,
    "observedVatRegistrationTurnoverMinor",
  );
  money(
    input.callerVerifiedVatRegistrationTurnoverThresholdMinor,
    "callerVerifiedVatRegistrationTurnoverThresholdMinor",
  );
  return {
    signedThresholdExcessMinor: signedSum([
      input.observedVatRegistrationTurnoverMinor,
      -input.callerVerifiedVatRegistrationTurnoverThresholdMinor,
    ]),
    callerThresholdReached:
      input.observedVatRegistrationTurnoverMinor >=
      input.callerVerifiedVatRegistrationTurnoverThresholdMinor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedVatRegistrationTurnoverMinor: 120,
  callerVerifiedVatRegistrationTurnoverThresholdMinor: 100,
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
  id: "taxation/vat-registration-threshold-turnover-checker",
  title: "VAT Registration Threshold Turnover Checker",
  description:
    "VAT registration matching rolling turnover and independently verified jurisdiction threshold, no inferred VAT registration duty. Integer minor units one caller currency, explicit inclusive threshold. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      observedVatRegistrationTurnoverMinor:
        value.observedVatRegistrationTurnoverMinor as number,
      callerVerifiedVatRegistrationTurnoverThresholdMinor:
        value.callerVerifiedVatRegistrationTurnoverThresholdMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
