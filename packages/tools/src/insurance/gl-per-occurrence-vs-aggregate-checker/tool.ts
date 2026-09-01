import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, sumMoney, money } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerGlPerOccurrenceLimitMinor: number;
  readonly callerGlAggregateLimitMinor: number;
  readonly callerIndependentlyCoveredOccurrenceAmountsMinor: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerOccurrencePaymentsMinor: readonly number[];
  readonly closingGlAggregateRemainingMinor: number;
  readonly totalAmountBeyondCallerGlLimitsMinor: number;
}>;
const inputFields = [
  {
    id: "callerGlPerOccurrenceLimitMinor",
    label: "Caller gl per occurrence limit minor",
    kind: "number",
  },
  {
    id: "callerGlAggregateLimitMinor",
    label: "Caller gl aggregate limit minor",
    kind: "number",
  },
  {
    id: "callerIndependentlyCoveredOccurrenceAmountsMinor",
    label: "Caller independently covered occurrence amounts minor",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.callerGlPerOccurrenceLimitMinor);
  money(input.callerGlAggregateLimitMinor);
  input.callerIndependentlyCoveredOccurrenceAmountsMinor.forEach((v) =>
    money(v),
  );
  let remaining = input.callerGlAggregateLimitMinor;
  const paid = input.callerIndependentlyCoveredOccurrenceAmountsMinor.map(
    (v) => {
      const amount = Math.min(
        v,
        input.callerGlPerOccurrenceLimitMinor,
        remaining,
      );
      remaining -= amount;
      return amount;
    },
  );
  return {
    callerOccurrencePaymentsMinor: paid,
    closingGlAggregateRemainingMinor: remaining,
    totalAmountBeyondCallerGlLimitsMinor:
      sumMoney(input.callerIndependentlyCoveredOccurrenceAmountsMinor) -
      sumMoney(paid),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerGlPerOccurrenceLimitMinor: 10000,
  callerGlAggregateLimitMinor: 15000,
  callerIndependentlyCoveredOccurrenceAmountsMinor: [12000, 8000],
} satisfies Input;
export const exampleOutput = {
  callerOccurrencePaymentsMinor: [10000, 5000],
  closingGlAggregateRemainingMinor: 0,
  totalAmountBeyondCallerGlLimitsMinor: 5000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/gl-per-occurrence-vs-aggregate-checker",
  title: "GL Per Occurrence vs Aggregate Checker",
  description:
    "Route actual independently covered GL occurrence amounts chronologically through per-occurrence and shared aggregate limits; no occurrence clustering/deductible adjudication or coverage determination.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerOccurrencePaymentsMinor",
      label: "Caller occurrence payments minor",
      kind: "numberList",
    },
    {
      id: "closingGlAggregateRemainingMinor",
      label: "Closing gl aggregate remaining minor",
      kind: "number",
    },
    {
      id: "totalAmountBeyondCallerGlLimitsMinor",
      label: "Total amount beyond caller gl limits minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerGlPerOccurrenceLimitMinor:
        value.callerGlPerOccurrenceLimitMinor as number,
      callerGlAggregateLimitMinor: value.callerGlAggregateLimitMinor as number,
      callerIndependentlyCoveredOccurrenceAmountsMinor:
        value.callerIndependentlyCoveredOccurrenceAmountsMinor as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
