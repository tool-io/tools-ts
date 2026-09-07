import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, ordered, money } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly earnedIncomeMinor: number;
  readonly callerApplicableLowerMinor: number;
  readonly callerApplicableUpperMinor: number;
}>;
export type Output = Readonly<{
  readonly signedEarnedIncomeRangeMarginMinor: number;
  readonly callerRangeScreen: boolean;
}>;
const inputFields = [
  { id: "earnedIncomeMinor", label: "Earned income minor", kind: "number" },
  {
    id: "callerApplicableLowerMinor",
    label: "Caller applicable lower minor",
    kind: "number",
  },
  {
    id: "callerApplicableUpperMinor",
    label: "Caller applicable upper minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.earnedIncomeMinor, "earnedIncomeMinor");
  money(input.callerApplicableLowerMinor, "callerApplicableLowerMinor");
  money(input.callerApplicableUpperMinor, "callerApplicableUpperMinor");
  ordered(input.callerApplicableLowerMinor, input.callerApplicableUpperMinor);
  const m = Math.min(
    input.earnedIncomeMinor - input.callerApplicableLowerMinor,
    input.callerApplicableUpperMinor - input.earnedIncomeMinor,
  );
  return { signedEarnedIncomeRangeMarginMinor: m, callerRangeScreen: m >= 0 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  earnedIncomeMinor: 100,
  callerApplicableLowerMinor: 20,
  callerApplicableUpperMinor: 80,
} satisfies Input;
export const exampleOutput = {
  signedEarnedIncomeRangeMarginMinor: -20,
  callerRangeScreen: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/eitc-earned-income-range-checker",
  title: "EITC Earned Income Range Checker",
  description:
    "Independently applicable EITC earned-income interval; no credit eligibility from earned-income alone (AGI/children/status external). Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedEarnedIncomeRangeMarginMinor",
      label: "Signed earned income range margin minor",
      kind: "number",
    },
    { id: "callerRangeScreen", label: "Caller range screen", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      earnedIncomeMinor: value.earnedIncomeMinor as number,
      callerApplicableLowerMinor: value.callerApplicableLowerMinor as number,
      callerApplicableUpperMinor: value.callerApplicableUpperMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
