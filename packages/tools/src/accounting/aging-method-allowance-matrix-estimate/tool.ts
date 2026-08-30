import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  sumMoney,
  bounded,
  aligned,
  weightedMinor,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly bucketReceivablesMinor: readonly number[];
  readonly callerLossRateBasisPoints: readonly number[];
  readonly existingAllowanceCreditBalanceMinor: number;
}>;
export type Output = Readonly<{
  readonly modeledLossByBucketMinor: readonly number[];
  readonly requiredAllowanceMinor: number;
  readonly signedAllowanceAdjustmentMinor: number;
}>;
const inputFields = [
  {
    id: "bucketReceivablesMinor",
    label: "Bucket receivables minor",
    kind: "numberList",
  },
  {
    id: "callerLossRateBasisPoints",
    label: "Caller loss rate basis points",
    kind: "numberList",
  },
  {
    id: "existingAllowanceCreditBalanceMinor",
    label: "Existing allowance credit balance minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.bucketReceivablesMinor.forEach((v) =>
    money(v, "bucketReceivablesMinor"),
  );
  integer(
    input.existingAllowanceCreditBalanceMinor,
    "existingAllowanceCreditBalanceMinor",
  );
  aligned(
    input.bucketReceivablesMinor,
    input.callerLossRateBasisPoints,
    "bucketReceivablesMinor",
  );
  input.callerLossRateBasisPoints.forEach((v) =>
    bounded(v, "lossBasisPoints", 0, 10000),
  );
  const losses = input.bucketReceivablesMinor.map((v, i) =>
      weightedMinor(v, input.callerLossRateBasisPoints[i], 10000),
    ),
    total = sumMoney(losses);
  return {
    modeledLossByBucketMinor: losses,
    requiredAllowanceMinor: total,
    signedAllowanceAdjustmentMinor: integer(
      total - input.existingAllowanceCreditBalanceMinor,
      "adjustment",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  bucketReceivablesMinor: [1000, 2000],
  callerLossRateBasisPoints: [100, 500],
  existingAllowanceCreditBalanceMinor: 60,
} satisfies Input;
export const exampleOutput = {
  modeledLossByBucketMinor: [10, 100],
  requiredAllowanceMinor: 110,
  signedAllowanceAdjustmentMinor: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/aging-method-allowance-matrix-estimate",
  title: "Aging Method Allowance Matrix Estimate Calculator",
  description:
    "Apply explicit caller aging-bucket loss basis points with per-bucket half-up minor-unit rounding and true-up against signed existing credit allowance; not the existing single percent-of-AR estimate or a certified impairment model.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledLossByBucketMinor",
      label: "Modeled loss by bucket minor",
      kind: "numberList",
    },
    {
      id: "requiredAllowanceMinor",
      label: "Required allowance minor",
      kind: "number",
    },
    {
      id: "signedAllowanceAdjustmentMinor",
      label: "Signed allowance adjustment minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      bucketReceivablesMinor: value.bucketReceivablesMinor as readonly number[],
      callerLossRateBasisPoints:
        value.callerLossRateBasisPoints as readonly number[],
      existingAllowanceCreditBalanceMinor:
        value.existingAllowanceCreditBalanceMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
