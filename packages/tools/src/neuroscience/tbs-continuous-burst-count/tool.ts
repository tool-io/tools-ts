import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  bounded,
  sum,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly actualDeliveredPulseCountsByIndependentlyQualifiedBurst: readonly number[];
  readonly callerPrescribedExpectedPulseCountsByBurst: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualDeliveredPulseCountsByIndependentlyQualifiedBurst",
    label: "Actual delivered pulse counts by independently qualified burst",
    kind: "numberList",
  },
  {
    id: "callerPrescribedExpectedPulseCountsByBurst",
    label: "Caller prescribed expected pulse counts by burst",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualDeliveredPulseCountsByIndependentlyQualifiedBurst,
    input.callerPrescribedExpectedPulseCountsByBurst,
    "bursts",
  );
  [
    input.actualDeliveredPulseCountsByIndependentlyQualifiedBurst,
    input.callerPrescribedExpectedPulseCountsByBurst,
  ].forEach((v) => v.forEach((x) => bounded(x, "pulses", 0, 1000000)));
  return {
    observedDeliveredBurstCount:
      input.actualDeliveredPulseCountsByIndependentlyQualifiedBurst.filter(
        (v) => v > 0,
      ).length,
    observedDeliveredPulseCount: sum(
      input.actualDeliveredPulseCountsByIndependentlyQualifiedBurst,
    ),
    signedPulseDiscrepanciesByBurst:
      input.actualDeliveredPulseCountsByIndependentlyQualifiedBurst.map(
        (v, i) => v - input.callerPrescribedExpectedPulseCountsByBurst[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualDeliveredPulseCountsByIndependentlyQualifiedBurst: [3, 3, 3],
    callerPrescribedExpectedPulseCountsByBurst: [3, 3, 3],
  },
  output: {
    result: {
      observedDeliveredBurstCount: 3,
      observedDeliveredPulseCount: 9,
      signedPulseDiscrepanciesByBurst: [0, 0, 0],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/tbs-continuous-burst-count",
  title: "Continuous TBS Burst Count Calculator",
  description:
    "Actual continuous TBS independently identified burst delivery ledger versus independently prescribed pulse plan. No universal burst/pulse schedule, protocol inference or permission to administer stimulation; zero-delivery bursts retained as discrepancies.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
