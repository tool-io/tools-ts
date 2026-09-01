import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  sumMoney,
  weightedMinor,
  money,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerAnnualIncomeReplacementMinor: number;
  readonly callerReplacementYears: number;
  readonly callerExistingIncomeProtectionFaceMinor: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerGrossIncomeReplacementNeedMinor: number;
  readonly totalExistingIncomeProtectionMinor: number;
  readonly signedIncomeReplacementGapMinor: number;
}>;
const inputFields = [
  {
    id: "callerAnnualIncomeReplacementMinor",
    label: "Caller annual income replacement minor",
    kind: "number",
  },
  {
    id: "callerReplacementYears",
    label: "Caller replacement years",
    kind: "number",
  },
  {
    id: "callerExistingIncomeProtectionFaceMinor",
    label: "Caller existing income protection face minor",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.callerAnnualIncomeReplacementMinor);
  bounded(input.callerReplacementYears, "years", 0, 100);
  input.callerExistingIncomeProtectionFaceMinor.forEach((v) => money(v));
  const gross = weightedMinor(
      input.callerAnnualIncomeReplacementMinor,
      input.callerReplacementYears,
      1,
    ),
    existing = sumMoney(input.callerExistingIncomeProtectionFaceMinor);
  return {
    callerGrossIncomeReplacementNeedMinor: gross,
    totalExistingIncomeProtectionMinor: existing,
    signedIncomeReplacementGapMinor: gross - existing,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAnnualIncomeReplacementMinor: 500000,
  callerReplacementYears: 10,
  callerExistingIncomeProtectionFaceMinor: [2000000, 1000000],
} satisfies Input;
export const exampleOutput = {
  callerGrossIncomeReplacementNeedMinor: 5000000,
  totalExistingIncomeProtectionMinor: 3000000,
  signedIncomeReplacementGapMinor: 2000000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/term-life-income-replacement-multiple",
  title: "Term Life Income Replacement Multiple Calculator",
  description:
    "Budget caller actual income replacement years and independent existing face inventory without time-value model; signed surplus retained, not a universal life-income multiple or recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerGrossIncomeReplacementNeedMinor",
      label: "Caller gross income replacement need minor",
      kind: "number",
    },
    {
      id: "totalExistingIncomeProtectionMinor",
      label: "Total existing income protection minor",
      kind: "number",
    },
    {
      id: "signedIncomeReplacementGapMinor",
      label: "Signed income replacement gap minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerAnnualIncomeReplacementMinor:
        value.callerAnnualIncomeReplacementMinor as number,
      callerReplacementYears: value.callerReplacementYears as number,
      callerExistingIncomeProtectionFaceMinor:
        value.callerExistingIncomeProtectionFaceMinor as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
