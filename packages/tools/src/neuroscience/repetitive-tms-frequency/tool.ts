import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  mean,
  strictlyIncreasing,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyRecordedPulseTimesSeconds: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyRecordedPulseTimesSeconds",
    label: "Independently recorded pulse times seconds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  strictlyIncreasing(input.independentlyRecordedPulseTimesSeconds, "pulses", 2);
  const g = input.independentlyRecordedPulseTimesSeconds
    .slice(1)
    .map((v, i) => v - input.independentlyRecordedPulseTimesSeconds[i]);
  return {
    observedMeanInterpulseSeconds: mean(g),
    observedPulseIntervalFrequencyHz: 1 / mean(g),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyRecordedPulseTimesSeconds: [0, 0.1, 0.2, 0.3] },
  output: {
    result: {
      observedMeanInterpulseSeconds: 0.1,
      observedPulseIntervalFrequencyHz: 10,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/repetitive-tms-frequency",
  title: "Repetitive TMS Frequency Calculator",
  description:
    "Actual recorded repetitive-TMSinterpulse interval frequency (N\u22121)/last-minus-first. Disjoint train gaps alter the reported aggregate; not programmed device validation or a recommended/safe stimulation frequency.",
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
