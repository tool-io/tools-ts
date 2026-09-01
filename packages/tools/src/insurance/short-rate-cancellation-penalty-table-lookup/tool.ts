import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  money,
  share,
  rating,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedElapsedTermDays: number;
  readonly callerCancellationDayLowerEdges: readonly number[];
  readonly callerVerifiedEarnedShortRateBasisPoints: readonly number[];
  readonly callerWrittenPremiumMinor: number;
  readonly callerCancellationFeeMinor: number;
}>;
export type Output = Readonly<{
  readonly callerShortRateEarnedPremiumMinor: number;
  readonly callerShortRateReturnPremiumMinor: number;
}>;
const inputFields = [
  {
    id: "observedElapsedTermDays",
    label: "Observed elapsed term days",
    kind: "number",
  },
  {
    id: "callerCancellationDayLowerEdges",
    label: "Caller cancellation day lower edges",
    kind: "numberList",
  },
  {
    id: "callerVerifiedEarnedShortRateBasisPoints",
    label: "Caller verified earned short rate basis points",
    kind: "numberList",
  },
  {
    id: "callerWrittenPremiumMinor",
    label: "Caller written premium minor",
    kind: "number",
  },
  {
    id: "callerCancellationFeeMinor",
    label: "Caller cancellation fee minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.observedElapsedTermDays, "days", 0, 3660);
  input.callerVerifiedEarnedShortRateBasisPoints.forEach((v) =>
    bounded(v, "bps", 0, 10000),
  );
  money(input.callerWrittenPremiumMinor);
  money(input.callerCancellationFeeMinor);
  const rate = rating(
      input.observedElapsedTermDays,
      input.callerCancellationDayLowerEdges,
      input.callerVerifiedEarnedShortRateBasisPoints,
    ),
    earned = share(input.callerWrittenPremiumMinor, rate);
  return {
    callerShortRateEarnedPremiumMinor: earned,
    callerShortRateReturnPremiumMinor: Math.max(
      0,
      input.callerWrittenPremiumMinor -
        earned -
        input.callerCancellationFeeMinor,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedElapsedTermDays: 15,
  callerCancellationDayLowerEdges: [0, 10, 20],
  callerVerifiedEarnedShortRateBasisPoints: [1000, 3000, 5000],
  callerWrittenPremiumMinor: 10000,
  callerCancellationFeeMinor: 100,
} satisfies Input;
export const exampleOutput = {
  callerShortRateEarnedPremiumMinor: 3000,
  callerShortRateReturnPremiumMinor: 6900,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/short-rate-cancellation-penalty-table-lookup",
  title: "Short Rate Cancellation Penalty Table Lookup",
  description:
    "Read actual elapsed days in caller verified lower-inclusive short-rate earned-premium table, then subtract independent fee; no universal short-rate penalty or pro-rata/minimum-earned substitution.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerShortRateEarnedPremiumMinor",
      label: "Caller short rate earned premium minor",
      kind: "number",
    },
    {
      id: "callerShortRateReturnPremiumMinor",
      label: "Caller short rate return premium minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedElapsedTermDays: value.observedElapsedTermDays as number,
      callerCancellationDayLowerEdges:
        value.callerCancellationDayLowerEdges as readonly number[],
      callerVerifiedEarnedShortRateBasisPoints:
        value.callerVerifiedEarnedShortRateBasisPoints as readonly number[],
      callerWrittenPremiumMinor: value.callerWrittenPremiumMinor as number,
      callerCancellationFeeMinor: value.callerCancellationFeeMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
