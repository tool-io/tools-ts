import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedKitchenDischargesLitersMinute: readonly number[];
  readonly callerPeakConcurrencyFractions: readonly number[];
  readonly callerVerifiedRetentionMinutes: number;
  readonly callerUsableGreaseInterceptorFraction: number;
}>;
export type Output = Readonly<{
  readonly callerConcurrentKitchenFlowLitersMinute: number;
  readonly requiredUsableRetentionLiters: number;
  readonly requiredNominalInterceptorLiters: number;
}>;
const inputFields = [
  {
    id: "observedKitchenDischargesLitersMinute",
    label: "Observed kitchen discharges liters minute",
    kind: "numberList",
  },
  {
    id: "callerPeakConcurrencyFractions",
    label: "Caller peak concurrency fractions",
    kind: "numberList",
  },
  {
    id: "callerVerifiedRetentionMinutes",
    label: "Caller verified retention minutes",
    kind: "number",
  },
  {
    id: "callerUsableGreaseInterceptorFraction",
    label: "Caller usable grease interceptor fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerVerifiedRetentionMinutes,
    "callerVerifiedRetentionMinutes",
  );
  positive(
    input.callerUsableGreaseInterceptorFraction,
    "callerUsableGreaseInterceptorFraction",
  );
  input.observedKitchenDischargesLitersMinute.forEach((v) =>
    nonnegative(v, "observedKitchenDischargesLitersMinute"),
  );
  input.callerPeakConcurrencyFractions.forEach((v) =>
    fraction(v, "callerPeakConcurrencyFractions"),
  );
  fraction(
    input.callerUsableGreaseInterceptorFraction,
    "callerUsableGreaseInterceptorFraction",
  );
  aligned(
    input.observedKitchenDischargesLitersMinute,
    input.callerPeakConcurrencyFractions,
    "observedKitchenDischargesLitersMinute",
  );
  const flow = sum(
      input.observedKitchenDischargesLitersMinute.map(
        (v, i) => v * input.callerPeakConcurrencyFractions[i],
      ),
    ),
    usable = flow * input.callerVerifiedRetentionMinutes;
  return {
    callerConcurrentKitchenFlowLitersMinute: flow,
    requiredUsableRetentionLiters: usable,
    requiredNominalInterceptorLiters:
      usable / input.callerUsableGreaseInterceptorFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedKitchenDischargesLitersMinute: [10, 20],
  callerPeakConcurrencyFractions: [1, 0.5],
  callerVerifiedRetentionMinutes: 2,
  callerUsableGreaseInterceptorFraction: 0.8,
} satisfies Input;
export const exampleOutput = {
  callerConcurrentKitchenFlowLitersMinute: 20,
  requiredUsableRetentionLiters: 40,
  requiredNominalInterceptorLiters: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/grease-interceptor-size",
  title: "Plumbing Grease Interceptor Size Calculator",
  description:
    "Budget actual kitchen discharges under caller concurrency/retention/usable volume assumptions; not hydraulic grease separation efficiency, universal fixture-code interceptor sizing or sanitation approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerConcurrentKitchenFlowLitersMinute",
      label: "Caller concurrent kitchen flow liters minute",
      kind: "number",
    },
    {
      id: "requiredUsableRetentionLiters",
      label: "Required usable retention liters",
      kind: "number",
    },
    {
      id: "requiredNominalInterceptorLiters",
      label: "Required nominal interceptor liters",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedKitchenDischargesLitersMinute:
        value.observedKitchenDischargesLitersMinute as readonly number[],
      callerPeakConcurrencyFractions:
        value.callerPeakConcurrencyFractions as readonly number[],
      callerVerifiedRetentionMinutes:
        value.callerVerifiedRetentionMinutes as number,
      callerUsableGreaseInterceptorFraction:
        value.callerUsableGreaseInterceptorFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
