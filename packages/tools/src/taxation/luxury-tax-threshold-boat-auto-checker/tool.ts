import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, money, signedSum } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedLuxuryTaxBaseMinor: number;
  readonly callerVerifiedLuxuryTaxBaseThresholdMinor: number;
}>;
export type Output = Readonly<{
  readonly signedThresholdExcessMinor: number;
  readonly callerThresholdReached: boolean;
}>;
const inputFields = [
  {
    id: "observedLuxuryTaxBaseMinor",
    label: "Observed luxury tax base minor",
    kind: "number",
  },
  {
    id: "callerVerifiedLuxuryTaxBaseThresholdMinor",
    label: "Caller verified luxury tax base threshold minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.observedLuxuryTaxBaseMinor, "observedLuxuryTaxBaseMinor");
  money(
    input.callerVerifiedLuxuryTaxBaseThresholdMinor,
    "callerVerifiedLuxuryTaxBaseThresholdMinor",
  );
  return {
    signedThresholdExcessMinor: signedSum([
      input.observedLuxuryTaxBaseMinor,
      -input.callerVerifiedLuxuryTaxBaseThresholdMinor,
    ]),
    callerThresholdReached:
      input.observedLuxuryTaxBaseMinor >=
      input.callerVerifiedLuxuryTaxBaseThresholdMinor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLuxuryTaxBaseMinor: 120,
  callerVerifiedLuxuryTaxBaseThresholdMinor: 100,
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
  id: "taxation/luxury-tax-threshold-boat-auto-checker",
  title: "Luxury Tax Threshold Boat Auto Checker",
  description:
    "Caller independently applicable luxury boat/auto tax base against verified threshold. Integer minor units one caller currency, explicit inclusive threshold. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      observedLuxuryTaxBaseMinor: value.observedLuxuryTaxBaseMinor as number,
      callerVerifiedLuxuryTaxBaseThresholdMinor:
        value.callerVerifiedLuxuryTaxBaseThresholdMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
