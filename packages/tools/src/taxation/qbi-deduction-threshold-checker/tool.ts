import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, money, signedSum } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedQbiIncomeMinor: number;
  readonly callerVerifiedQbiIncomeThresholdMinor: number;
}>;
export type Output = Readonly<{
  readonly signedThresholdExcessMinor: number;
  readonly callerThresholdReached: boolean;
}>;
const inputFields = [
  {
    id: "observedQbiIncomeMinor",
    label: "Observed qbi income minor",
    kind: "number",
  },
  {
    id: "callerVerifiedQbiIncomeThresholdMinor",
    label: "Caller verified qbi income threshold minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.observedQbiIncomeMinor, "observedQbiIncomeMinor");
  money(
    input.callerVerifiedQbiIncomeThresholdMinor,
    "callerVerifiedQbiIncomeThresholdMinor",
  );
  return {
    signedThresholdExcessMinor: signedSum([
      input.observedQbiIncomeMinor,
      -input.callerVerifiedQbiIncomeThresholdMinor,
    ]),
    callerThresholdReached:
      input.observedQbiIncomeMinor >=
      input.callerVerifiedQbiIncomeThresholdMinor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedQbiIncomeMinor: 120,
  callerVerifiedQbiIncomeThresholdMinor: 100,
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
  id: "taxation/qbi-deduction-threshold-checker",
  title: "QBI Deduction Threshold Checker",
  description:
    "QBI taxpayer income vs independently applicable year/status threshold, not full qualified business income deduction. Integer minor units one caller currency, explicit inclusive threshold. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      observedQbiIncomeMinor: value.observedQbiIncomeMinor as number,
      callerVerifiedQbiIncomeThresholdMinor:
        value.callerVerifiedQbiIncomeThresholdMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
