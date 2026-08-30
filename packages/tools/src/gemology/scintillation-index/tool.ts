import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  ordered,
  integral,
} from "../shared.js";
export type Input = Readonly<{
  readonly frameTimesSeconds: readonly number[];
  readonly measuredFacetBrightness: readonly number[];
}>;
export type Output = Readonly<{
  readonly relativeTemporalScintillationRms: number;
  readonly observedBrightnessVariationPerSecond: number;
}>;
const inputFields = [
  { id: "frameTimesSeconds", label: "Frame times seconds", kind: "numberList" },
  {
    id: "measuredFacetBrightness",
    label: "Measured facet brightness",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredFacetBrightness.forEach((v) =>
    nonnegative(v, "measuredFacetBrightness"),
  );
  const t = input.frameTimesSeconds,
    y = input.measuredFacetBrightness;
  ordered(t, "times");
  aligned(t, y, "frames");
  const duration = t.at(-1)! - t[0],
    m = positive(integral(t, y) / duration, "meanBrightness");
  let square = 0,
    variation = 0;
  for (let i = 1; i < t.length; i++) {
    const a = y[i - 1] - m,
      b = y[i] - m;
    square += ((t[i] - t[i - 1]) * (a * a + a * b + b * b)) / 3;
    variation += Math.abs(y[i] - y[i - 1]);
  }
  return {
    relativeTemporalScintillationRms: Math.sqrt(square / duration) / m,
    observedBrightnessVariationPerSecond: variation / duration,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  frameTimesSeconds: [0, 1, 3],
  measuredFacetBrightness: [1, 3, 1],
} satisfies Input;
export const exampleOutput = {
  relativeTemporalScintillationRms: 0.28867513459481287,
  observedBrightnessVariationPerSecond: 1.3333333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/scintillation-index",
  title: "Scintillation Pattern Index",
  description:
    "Integrate measured temporal brightness variation under piecewise-linear frames, retaining actual exposure; scalar scintillation proxy is not complete observer-dependent sparkle or commercial grade.",
  inputs: inputFields,
  outputs: [
    {
      id: "relativeTemporalScintillationRms",
      label: "Relative temporal scintillation rms",
      kind: "number",
    },
    {
      id: "observedBrightnessVariationPerSecond",
      label: "Observed brightness variation per second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      frameTimesSeconds: value.frameTimesSeconds as readonly number[],
      measuredFacetBrightness:
        value.measuredFacetBrightness as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
