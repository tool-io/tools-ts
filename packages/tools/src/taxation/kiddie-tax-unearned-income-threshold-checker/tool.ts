import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, money, signedSum } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedKiddieUnearnedIncomeMinor: number;
  readonly callerVerifiedKiddieUnearnedIncomeThresholdMinor: number;
}>;
export type Output = Readonly<{
  readonly signedThresholdExcessMinor: number;
  readonly callerThresholdReached: boolean;
}>;
const inputFields = [
  {
    id: "observedKiddieUnearnedIncomeMinor",
    label: "Observed kiddie unearned income minor",
    kind: "number",
  },
  {
    id: "callerVerifiedKiddieUnearnedIncomeThresholdMinor",
    label: "Caller verified kiddie unearned income threshold minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(
    input.observedKiddieUnearnedIncomeMinor,
    "observedKiddieUnearnedIncomeMinor",
  );
  money(
    input.callerVerifiedKiddieUnearnedIncomeThresholdMinor,
    "callerVerifiedKiddieUnearnedIncomeThresholdMinor",
  );
  return {
    signedThresholdExcessMinor: signedSum([
      input.observedKiddieUnearnedIncomeMinor,
      -input.callerVerifiedKiddieUnearnedIncomeThresholdMinor,
    ]),
    callerThresholdReached:
      input.observedKiddieUnearnedIncomeMinor >=
      input.callerVerifiedKiddieUnearnedIncomeThresholdMinor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedKiddieUnearnedIncomeMinor: 120,
  callerVerifiedKiddieUnearnedIncomeThresholdMinor: 100,
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
  id: "taxation/kiddie-tax-unearned-income-threshold-checker",
  title: "Kiddie Tax Unearned Income Threshold Checker",
  description:
    "Unearned-income threshold screen with caller verified tax-year/age/dependency applicability. Integer minor units one caller currency, explicit inclusive threshold. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      observedKiddieUnearnedIncomeMinor:
        value.observedKiddieUnearnedIncomeMinor as number,
      callerVerifiedKiddieUnearnedIncomeThresholdMinor:
        value.callerVerifiedKiddieUnearnedIncomeThresholdMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
