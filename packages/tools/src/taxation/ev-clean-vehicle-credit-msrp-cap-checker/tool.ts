import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, money, signedSum } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedEvVerifiedMsrpMinor: number;
  readonly callerVerifiedEvVerifiedMsrpThresholdMinor: number;
}>;
export type Output = Readonly<{
  readonly signedThresholdExcessMinor: number;
  readonly callerThresholdReached: boolean;
}>;
const inputFields = [
  {
    id: "observedEvVerifiedMsrpMinor",
    label: "Observed ev verified msrp minor",
    kind: "number",
  },
  {
    id: "callerVerifiedEvVerifiedMsrpThresholdMinor",
    label: "Caller verified ev verified msrp threshold minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.observedEvVerifiedMsrpMinor, "observedEvVerifiedMsrpMinor");
  money(
    input.callerVerifiedEvVerifiedMsrpThresholdMinor,
    "callerVerifiedEvVerifiedMsrpThresholdMinor",
  );
  return {
    signedThresholdExcessMinor: signedSum([
      input.observedEvVerifiedMsrpMinor,
      -input.callerVerifiedEvVerifiedMsrpThresholdMinor,
    ]),
    callerThresholdReached:
      input.observedEvVerifiedMsrpMinor >=
      input.callerVerifiedEvVerifiedMsrpThresholdMinor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedEvVerifiedMsrpMinor: 120,
  callerVerifiedEvVerifiedMsrpThresholdMinor: 100,
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
  id: "taxation/ev-clean-vehicle-credit-msrp-cap-checker",
  title: "EV Clean Vehicle Credit MSRP Cap Checker",
  description:
    "Caller independently verified vehicle MSRP/type/year against applicable credit cap; no clean-vehicle credit eligibility. Integer minor units one caller currency, explicit inclusive threshold. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      observedEvVerifiedMsrpMinor: value.observedEvVerifiedMsrpMinor as number,
      callerVerifiedEvVerifiedMsrpThresholdMinor:
        value.callerVerifiedEvVerifiedMsrpThresholdMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
