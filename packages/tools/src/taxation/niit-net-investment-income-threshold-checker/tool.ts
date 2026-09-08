import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, money, rateMinor } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly eligibleNetInvestmentIncomeMinor: number;
  readonly magiMinor: number;
  readonly callerMagiThresholdMinor: number;
  readonly callerNiitBasisPoints: number;
}>;
export type Output = Readonly<{
  readonly niitScreenBaseMinor: number;
  readonly conditionalNiitMinor: number;
}>;
const inputFields = [
  {
    id: "eligibleNetInvestmentIncomeMinor",
    label: "Eligible net investment income minor",
    kind: "number",
  },
  { id: "magiMinor", label: "Magi minor", kind: "number" },
  {
    id: "callerMagiThresholdMinor",
    label: "Caller magi threshold minor",
    kind: "number",
  },
  {
    id: "callerNiitBasisPoints",
    label: "Caller niit basis points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(
    input.eligibleNetInvestmentIncomeMinor,
    "eligibleNetInvestmentIncomeMinor",
  );
  money(input.magiMinor, "magiMinor");
  money(input.callerMagiThresholdMinor, "callerMagiThresholdMinor");
  const b = Math.min(
    input.eligibleNetInvestmentIncomeMinor,
    Math.max(0, input.magiMinor - input.callerMagiThresholdMinor),
  );
  return {
    niitScreenBaseMinor: b,
    conditionalNiitMinor: rateMinor(b, input.callerNiitBasisPoints),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  eligibleNetInvestmentIncomeMinor: 100,
  magiMinor: 250,
  callerMagiThresholdMinor: 200,
  callerNiitBasisPoints: 380,
} satisfies Input;
export const exampleOutput = {
  niitScreenBaseMinor: 50,
  conditionalNiitMinor: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/niit-net-investment-income-threshold-checker",
  title: "NIIT Net Investment Income Threshold Checker",
  description:
    "NIIT min(eligibleNII, positiveMAGIexcess)×caller applicable rate; no NIIT applicability/category decisions. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "niitScreenBaseMinor",
      label: "Niit screen base minor",
      kind: "number",
    },
    {
      id: "conditionalNiitMinor",
      label: "Conditional niit minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      eligibleNetInvestmentIncomeMinor:
        value.eligibleNetInvestmentIncomeMinor as number,
      magiMinor: value.magiMinor as number,
      callerMagiThresholdMinor: value.callerMagiThresholdMinor as number,
      callerNiitBasisPoints: value.callerNiitBasisPoints as number,
    }),
});
export const run = tool.execute;
export default tool;
