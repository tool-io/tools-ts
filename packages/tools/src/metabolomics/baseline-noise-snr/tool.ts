import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly baselineIntensities: readonly number[];
  readonly peakHeight: number;
}>;
export type Output = Readonly<{
  readonly baselineMean: number;
  readonly noiseStdDev: number;
  readonly signalToNoise: number;
}>;
export const calculate = (input: Input): Output => {
  const x = input.baselineIntensities;
  if (x.length < 2)
    simpleError(
      "baselineIntensities",
      "At least two baseline intensities required.",
    );
  const baselineMean = x.reduce((a, b) => a + b, 0) / x.length,
    noiseStdDev = Math.sqrt(
      x.reduce((s, v) => s + (v - baselineMean) ** 2, 0) / x.length,
    );
  if (noiseStdDev <= 0)
    simpleError("baselineIntensities", "Baseline must vary.");
  return {
    baselineMean,
    noiseStdDev,
    signalToNoise: (input.peakHeight - baselineMean) / noiseStdDev,
  };
};
export const exampleInput = {
  baselineIntensities: [8, 10, 12],
  peakHeight: 20,
} satisfies Input;
export const exampleOutput = {
  baselineMean: 10,
  noiseStdDev: 1.632993161855452,
  signalToNoise: 6.123724356957945,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/baseline-noise-snr",
  title: "Baseline Noise Snr",
  description:
    "Estimate baseline noise and signal-to-noise from a sampled segment.",
  inputs: [
    {
      id: "baselineIntensities",
      kind: "numberList",
      label: "Baseline intensities",
    },
    { id: "peakHeight", kind: "number", label: "Peak height" },
  ],
  outputs: [
    { id: "baselineMean", kind: "number", label: "Baseline mean" },
    { id: "noiseStdDev", kind: "number", label: "Noise std dev" },
    { id: "signalToNoise", kind: "number", label: "Signal to noise" },
  ],
  calculate: (value) =>
    calculate({
      baselineIntensities: value.baselineIntensities as readonly number[],
      peakHeight: value.peakHeight as number,
    }),
});
export const run = tool.execute;
export default tool;
