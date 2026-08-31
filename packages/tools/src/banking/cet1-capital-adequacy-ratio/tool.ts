import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  sumMoney,
  positive,
  nonnegative,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly reportedCet1BeforeDeductionsMinor: number;
  readonly callerRequiredCet1DeductionsMinor: readonly number[];
  readonly riskWeightedAssetsMinor: number;
  readonly callerRequiredCet1RatioPercent: number;
}>;
export type Output = Readonly<{
  readonly adjustedCet1CapitalMinor: number;
  readonly adjustedCet1RatioPercent: number;
  readonly signedCet1RatioMarginPercentagePoints: number;
  readonly meetsCallerCet1RatioPolicy: boolean;
}>;
const inputFields = [
  {
    id: "reportedCet1BeforeDeductionsMinor",
    label: "Reported cet1 before deductions minor",
    kind: "number",
  },
  {
    id: "callerRequiredCet1DeductionsMinor",
    label: "Caller required cet1 deductions minor",
    kind: "numberList",
  },
  {
    id: "riskWeightedAssetsMinor",
    label: "Risk weighted assets minor",
    kind: "number",
  },
  {
    id: "callerRequiredCet1RatioPercent",
    label: "Caller required cet1 ratio percent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(
    input.reportedCet1BeforeDeductionsMinor,
    "reportedCet1BeforeDeductionsMinor",
  );
  input.callerRequiredCet1DeductionsMinor.forEach((v) =>
    money(v, "callerRequiredCet1DeductionsMinor"),
  );
  money(input.riskWeightedAssetsMinor, "riskWeightedAssetsMinor");
  positive(input.riskWeightedAssetsMinor, "rwa");
  nonnegative(input.callerRequiredCet1RatioPercent, "policy");
  const capital = integer(
      input.reportedCet1BeforeDeductionsMinor -
        sumMoney(input.callerRequiredCet1DeductionsMinor),
      "capital",
    ),
    ratio = (100 * capital) / input.riskWeightedAssetsMinor;
  return {
    adjustedCet1CapitalMinor: capital,
    adjustedCet1RatioPercent: ratio,
    signedCet1RatioMarginPercentagePoints:
      ratio - input.callerRequiredCet1RatioPercent,
    meetsCallerCet1RatioPolicy: ratio >= input.callerRequiredCet1RatioPercent,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  reportedCet1BeforeDeductionsMinor: 1000,
  callerRequiredCet1DeductionsMinor: [100, 50],
  riskWeightedAssetsMinor: 10000,
  callerRequiredCet1RatioPercent: 8,
} satisfies Input;
export const exampleOutput = {
  adjustedCet1CapitalMinor: 850,
  adjustedCet1RatioPercent: 8.5,
  signedCet1RatioMarginPercentagePoints: 0.5,
  meetsCallerCet1RatioPolicy: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/cet1-capital-adequacy-ratio",
  title: "CET1 Capital Adequacy Ratio Calculator",
  description:
    "Reconcile actual caller CET1 deductions and RWA against explicit ratio policy, preserving negative capital/margin; eligible capital/RWA and buffers are caller classified, no regulator-specific compliance finding.",
  inputs: inputFields,
  outputs: [
    {
      id: "adjustedCet1CapitalMinor",
      label: "Adjusted cet1 capital minor",
      kind: "number",
    },
    {
      id: "adjustedCet1RatioPercent",
      label: "Adjusted cet1 ratio percent",
      kind: "number",
    },
    {
      id: "signedCet1RatioMarginPercentagePoints",
      label: "Signed cet1 ratio margin percentage points",
      kind: "number",
    },
    {
      id: "meetsCallerCet1RatioPolicy",
      label: "Meets caller cet1 ratio policy",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      reportedCet1BeforeDeductionsMinor:
        value.reportedCet1BeforeDeductionsMinor as number,
      callerRequiredCet1DeductionsMinor:
        value.callerRequiredCet1DeductionsMinor as readonly number[],
      riskWeightedAssetsMinor: value.riskWeightedAssetsMinor as number,
      callerRequiredCet1RatioPercent:
        value.callerRequiredCet1RatioPercent as number,
    }),
});
export const run = tool.execute;
export default tool;
