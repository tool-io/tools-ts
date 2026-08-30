import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly gddSamplesFs2: readonly number[];
}>;
export type Output = Readonly<{
  readonly meanGddFs2: number;
  readonly peakToPeakRippleFs2: number;
  readonly rmsRippleFs2: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.gddSamplesFs2.length === 0)
    simpleError(
      "gddSamplesFs2",
      "At least one GDD sample is required.",
      "empty_samples",
    );
  const meanGddFs2 =
    input.gddSamplesFs2.reduce((a, b) => a + b, 0) / input.gddSamplesFs2.length;
  return {
    meanGddFs2,
    peakToPeakRippleFs2:
      Math.max(...input.gddSamplesFs2) - Math.min(...input.gddSamplesFs2),
    rmsRippleFs2: Math.sqrt(
      input.gddSamplesFs2.reduce(
        (sum, value) => sum + (value - meanGddFs2) ** 2,
        0,
      ) / input.gddSamplesFs2.length,
    ),
  };
};

export const exampleInput = { gddSamplesFs2: [-1, 1] } satisfies Input;
export const exampleOutput = {
  meanGddFs2: 0,
  peakToPeakRippleFs2: 2,
  rmsRippleFs2: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      gddSamplesFs2: input.gddSamplesFs2 as readonly number[],
    }),
  description: "Summarize dispersive-mirror group-delay-dispersion ripple.",
  id: "laser/gdd-ripple",
  inputs: [
    {
      id: "gddSamplesFs2",
      label: "GDD samples",
      kind: "numberList",
      unit: "fs²",
    },
  ],
  outputs: [
    { id: "meanGddFs2", label: "Mean GDD", kind: "number", unit: "fs²" },
    {
      id: "peakToPeakRippleFs2",
      label: "Peak-to-peak ripple",
      kind: "number",
      minimum: 0,
      unit: "fs²",
    },
    {
      id: "rmsRippleFs2",
      label: "RMS ripple",
      kind: "number",
      minimum: 0,
      unit: "fs²",
    },
  ],
  title: "GDD Ripple",
});

export const run = tool.execute;
export default tool;
