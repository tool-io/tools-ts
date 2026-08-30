import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, count } from "../shared.js";
export type Input = Readonly<{
  readonly sampleCount: number;
  readonly dwellMicroseconds: number;
}>;
export type Output = Readonly<{
  readonly acquisitionDurationMs: number;
  readonly firstLastSampleSpanMs: number;
}>;
const inputFields = [
  { id: "sampleCount", label: "Sample count", kind: "integer" },
  { id: "dwellMicroseconds", label: "Dwell microseconds", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  count(input.sampleCount, "sampleCount", 1);
  positive(input.dwellMicroseconds, "dwellMicroseconds");
  return {
    acquisitionDurationMs: (input.sampleCount * input.dwellMicroseconds) / 1000,
    firstLastSampleSpanMs:
      ((input.sampleCount - 1) * input.dwellMicroseconds) / 1000,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sampleCount: 256,
  dwellMicroseconds: 10,
} satisfies Input;
export const exampleOutput = {
  acquisitionDurationMs: 2.56,
  firstLastSampleSpanMs: 2.55,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/adc-readout-duration",
  title: "Readout Time",
  description:
    "Distinguish N full ADC dwells from the (N−1)-dwell first-to-last timestamp span; gradient ramps are not included.",
  inputs: inputFields,
  outputs: [
    {
      id: "acquisitionDurationMs",
      label: "Acquisition duration ms",
      kind: "number",
      unit: "ms",
    },
    {
      id: "firstLastSampleSpanMs",
      label: "First last sample span ms",
      kind: "number",
      unit: "ms",
    },
  ],
  calculate: (value) =>
    calculate({
      sampleCount: value.sampleCount as number,
      dwellMicroseconds: value.dwellMicroseconds as number,
    }),
});
export const run = tool.execute;
export default tool;
