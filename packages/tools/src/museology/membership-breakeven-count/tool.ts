import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  money,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedFixedProgramCostMinor: number;
  readonly callerVerifiedNetFeePerMemberMinor: number;
  readonly callerVerifiedVariableCostPerMemberMinor: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVerifiedFixedProgramCostMinor",
    label: "Caller verified fixed program cost minor",
    kind: "number",
  },
  {
    id: "callerVerifiedNetFeePerMemberMinor",
    label: "Caller verified net fee per member minor",
    kind: "number",
  },
  {
    id: "callerVerifiedVariableCostPerMemberMinor",
    label: "Caller verified variable cost per member minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  [
    input.callerVerifiedFixedProgramCostMinor,
    input.callerVerifiedNetFeePerMemberMinor,
    input.callerVerifiedVariableCostPerMemberMinor,
  ].forEach((v) => money(v, "cost"));
  const c =
    BigInt(input.callerVerifiedNetFeePerMemberMinor) -
    BigInt(input.callerVerifiedVariableCostPerMemberMinor);
  if (c <= 0n)
    simpleError("contribution", "Positive net per-member contribution.");
  return {
    conditionalWholeBreakEvenMemberCount: Number(
      (BigInt(input.callerVerifiedFixedProgramCostMinor) + c - 1n) / c,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedFixedProgramCostMinor: 100,
    callerVerifiedNetFeePerMemberMinor: 30,
    callerVerifiedVariableCostPerMemberMinor: 10,
  },
  output: { result: { conditionalWholeBreakEvenMemberCount: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/membership-breakeven-count",
  title: "Membership Break-Even Member Count Calculator",
  description:
    "Conditional exact minor-unit ceil fixed-cost/contribution break-even with independently verified compatible programme cost/fee model. No demand forecast, member capacity or profitability guarantee.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
