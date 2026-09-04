import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  ordered,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedBusinessStartDay: number;
  readonly observedFirstPayingCustomerDay: number;
  readonly callerMatchedTimeBenchmarkDays: number;
}>;
export type Output = Readonly<{
  readonly observedTimeToFirstPaymentDays: number;
  readonly signedBenchmarkDepartureDays: number;
}>;
const inputFields = [
  {
    id: "observedBusinessStartDay",
    label: "Observed business start day",
    kind: "number",
  },
  {
    id: "observedFirstPayingCustomerDay",
    label: "Observed first paying customer day",
    kind: "number",
  },
  {
    id: "callerMatchedTimeBenchmarkDays",
    label: "Caller matched time benchmark days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerMatchedTimeBenchmarkDays,
    "callerMatchedTimeBenchmarkDays",
  );
  ordered(input.observedBusinessStartDay, input.observedFirstPayingCustomerDay);
  const d =
    input.observedFirstPayingCustomerDay - input.observedBusinessStartDay;
  return {
    observedTimeToFirstPaymentDays: d,
    signedBenchmarkDepartureDays: d - input.callerMatchedTimeBenchmarkDays,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBusinessStartDay: 0,
  observedFirstPayingCustomerDay: 20,
  callerMatchedTimeBenchmarkDays: 30,
} satisfies Input;
export const exampleOutput = {
  observedTimeToFirstPaymentDays: 20,
  signedBenchmarkDepartureDays: -10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/time-to-first-paying-customer-days-benchmark",
  title: "Time to First Paying Customer Days Benchmark",
  description:
    "Observed first paying customer elapsed days vs independently same-start/definition benchmark, not first activation/value or censored businesses without payment. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedTimeToFirstPaymentDays",
      label: "Observed time to first payment days",
      kind: "number",
    },
    {
      id: "signedBenchmarkDepartureDays",
      label: "Signed benchmark departure days",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBusinessStartDay: value.observedBusinessStartDay as number,
      observedFirstPayingCustomerDay:
        value.observedFirstPayingCustomerDay as number,
      callerMatchedTimeBenchmarkDays:
        value.callerMatchedTimeBenchmarkDays as number,
    }),
});
export const run = tool.execute;
export default tool;
