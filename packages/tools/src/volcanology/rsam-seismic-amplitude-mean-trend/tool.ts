import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, count } from "../shared.js";
export type Input = Readonly<{
  readonly detrendedGroundVelocitySamples: readonly number[];
  readonly windowSampleCount: number;
  readonly instrumentClipMagnitude: number;
}>;
export type Output = Readonly<{
  readonly rsamWindowMeans: readonly number[];
  readonly windowClippedSampleFractions: readonly number[];
  readonly lastMinusFirstRsam: number;
}>;
const inputFields = [
  {
    id: "detrendedGroundVelocitySamples",
    label: "Detrended ground velocity samples",
    kind: "numberList",
  },
  { id: "windowSampleCount", label: "Window sample count", kind: "integer" },
  {
    id: "instrumentClipMagnitude",
    label: "Instrument clip magnitude",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.windowSampleCount, "windowSampleCount");
  positive(input.instrumentClipMagnitude, "instrumentClipMagnitude");
  count(input.windowSampleCount, "windowSampleCount");
  if (
    !input.detrendedGroundVelocitySamples.length ||
    input.detrendedGroundVelocitySamples.length % input.windowSampleCount
  )
    simpleError(
      "samples",
      "A whole number of nonempty equal-sample RSAM windows required.",
    );
  const rsamWindowMeans: number[] = [],
    windowClippedSampleFractions: number[] = [];
  for (
    let i = 0;
    i < input.detrendedGroundVelocitySamples.length;
    i += input.windowSampleCount
  ) {
    let total = 0,
      clip = 0;
    for (let j = 0; j < input.windowSampleCount; j++) {
      const a = Math.abs(input.detrendedGroundVelocitySamples[i + j]);
      total += a;
      if (a >= input.instrumentClipMagnitude) clip++;
    }
    rsamWindowMeans.push(total / input.windowSampleCount);
    windowClippedSampleFractions.push(clip / input.windowSampleCount);
  }
  return {
    rsamWindowMeans,
    windowClippedSampleFractions,
    lastMinusFirstRsam: rsamWindowMeans.at(-1)! - rsamWindowMeans[0],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  detrendedGroundVelocitySamples: [-1, 1, -2, 2],
  windowSampleCount: 2,
  instrumentClipMagnitude: 3,
} satisfies Input;
export const exampleOutput = {
  rsamWindowMeans: [1, 2],
  windowClippedSampleFractions: [0, 0],
  lastMinusFirstRsam: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/rsam-seismic-amplitude-mean-trend",
  title: "RSAM Seismic Amplitude Mean Trend Tool",
  description:
    "Compute equal-duration mean absolute detrended ground-velocity RSAM windows with clipping diagnostics; inputs share a fixed sample rate/instrument response and output is not magnitude, tremor attribution or eruption diagnosis.",
  inputs: inputFields,
  outputs: [
    { id: "rsamWindowMeans", label: "Rsam window means", kind: "numberList" },
    {
      id: "windowClippedSampleFractions",
      label: "Window clipped sample fractions",
      kind: "numberList",
    },
    {
      id: "lastMinusFirstRsam",
      label: "Last minus first rsam",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      detrendedGroundVelocitySamples:
        value.detrendedGroundVelocitySamples as readonly number[],
      windowSampleCount: value.windowSampleCount as number,
      instrumentClipMagnitude: value.instrumentClipMagnitude as number,
    }),
});
export const run = tool.execute;
export default tool;
