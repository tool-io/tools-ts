import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  aligned,
  allocateMinor,
  signedSum,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly totalEarnedCommissionMinor: number;
  readonly callerPeriodAllocationWeights: readonly number[];
  readonly previouslyRecordedByPeriodMinor: readonly number[];
}>;
export type Output = Readonly<{
  readonly allocatedCommissionByPeriodMinor: readonly number[];
  readonly signedTrueUpsByPeriodMinor: readonly number[];
  readonly totalSignedTrueUpMinor: number;
}>;
const inputFields = [
  {
    id: "totalEarnedCommissionMinor",
    label: "Total earned commission minor",
    kind: "number",
  },
  {
    id: "callerPeriodAllocationWeights",
    label: "Caller period allocation weights",
    kind: "numberList",
  },
  {
    id: "previouslyRecordedByPeriodMinor",
    label: "Previously recorded by period minor",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.totalEarnedCommissionMinor, "totalEarnedCommissionMinor");
  input.previouslyRecordedByPeriodMinor.forEach((v) =>
    money(v, "previouslyRecordedByPeriodMinor"),
  );
  aligned(
    input.callerPeriodAllocationWeights,
    input.previouslyRecordedByPeriodMinor,
    "callerPeriodAllocationWeights",
  );
  const alloc = allocateMinor(
      input.totalEarnedCommissionMinor,
      input.callerPeriodAllocationWeights,
    ),
    deltas = alloc.map((v, i) =>
      integer(v - input.previouslyRecordedByPeriodMinor[i], "trueUp"),
    );
  return {
    allocatedCommissionByPeriodMinor: alloc,
    signedTrueUpsByPeriodMinor: deltas,
    totalSignedTrueUpMinor: signedSum(deltas),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  totalEarnedCommissionMinor: 100,
  callerPeriodAllocationWeights: [1, 2],
  previouslyRecordedByPeriodMinor: [30, 70],
} satisfies Input;
export const exampleOutput = {
  allocatedCommissionByPeriodMinor: [33, 67],
  signedTrueUpsByPeriodMinor: [3, -3],
  totalSignedTrueUpMinor: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/commission-accrual-period-allocation",
  title: "Commission Accrual Period Allocation Tool",
  description:
    "Allocate actual earned commission across caller period weights with exact largest-remainder tie rules and signed recorded-period true-ups; no revenue-performance period inferred from payment dates.",
  inputs: inputFields,
  outputs: [
    {
      id: "allocatedCommissionByPeriodMinor",
      label: "Allocated commission by period minor",
      kind: "numberList",
    },
    {
      id: "signedTrueUpsByPeriodMinor",
      label: "Signed true ups by period minor",
      kind: "numberList",
    },
    {
      id: "totalSignedTrueUpMinor",
      label: "Total signed true up minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      totalEarnedCommissionMinor: value.totalEarnedCommissionMinor as number,
      callerPeriodAllocationWeights:
        value.callerPeriodAllocationWeights as readonly number[],
      previouslyRecordedByPeriodMinor:
        value.previouslyRecordedByPeriodMinor as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
