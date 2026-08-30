import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, aligned, ordered } from "../shared.js";
export type Input = Readonly<{
  readonly timesSeconds: readonly number[];
  readonly voltagesMv: readonly number[];
  readonly referenceMv: number;
}>;
export type Output = Readonly<{
  readonly upcrossingTimesSeconds: readonly number[];
  readonly estimatedFrequencyHz: number;
}>;
const inputFields = [
  { id: "timesSeconds", label: "Times seconds", kind: "numberList" },
  { id: "voltagesMv", label: "Voltages mv", kind: "numberList" },
  { id: "referenceMv", label: "Reference mv", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.timesSeconds, input.voltagesMv, "timesSeconds");
  ordered(input.timesSeconds, "timesSeconds");
  const upcrossingTimesSeconds: number[] = [];
  for (let i = 1; i < input.timesSeconds.length; i++)
    if (
      input.voltagesMv[i - 1] < input.referenceMv &&
      input.voltagesMv[i] >= input.referenceMv
    )
      upcrossingTimesSeconds.push(
        input.timesSeconds[i - 1] +
          ((input.referenceMv - input.voltagesMv[i - 1]) /
            (input.voltagesMv[i] - input.voltagesMv[i - 1])) *
            (input.timesSeconds[i] - input.timesSeconds[i - 1]),
      );
  if (upcrossingTimesSeconds.length < 2)
    simpleError("referenceMv", "At least two upward crossings required.");
  return {
    upcrossingTimesSeconds,
    estimatedFrequencyHz:
      (upcrossingTimesSeconds.length - 1) /
      (upcrossingTimesSeconds.at(-1)! - upcrossingTimesSeconds[0]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesSeconds: [0, 1, 2, 3, 4, 5, 6],
  voltagesMv: [-1, 1, -1, 1, -1, 1, -1],
  referenceMv: 0,
} satisfies Input;
export const exampleOutput = {
  upcrossingTimesSeconds: [0.5, 2.5, 4.5],
  estimatedFrequencyHz: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/subthreshold-upcrossing-frequency",
  title: "Subthreshold Oscillation Frequency",
  description:
    "Estimate subthreshold oscillation frequency from interpolated upward reference crossings; spikes and drift must be removed beforehand and cadence must resolve the waveform.",
  inputs: inputFields,
  outputs: [
    {
      id: "upcrossingTimesSeconds",
      label: "Upcrossing times seconds",
      kind: "numberList",
    },
    {
      id: "estimatedFrequencyHz",
      label: "Estimated frequency hz",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      timesSeconds: value.timesSeconds as readonly number[],
      voltagesMv: value.voltagesMv as readonly number[],
      referenceMv: value.referenceMv as number,
    }),
});
export const run = tool.execute;
export default tool;
