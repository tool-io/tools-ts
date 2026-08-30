import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly intensities: readonly number[];
  readonly logRatios: readonly number[];
  readonly bandwidth: number;
}>;
export type Output = Readonly<{
  readonly correctedLogRatios: readonly number[];
  readonly estimatedBias: readonly number[];
}>;

export const calculate = (input: Input): Output => {
  const n = input.intensities.length;
  if (n === 0 || input.logRatios.length !== n || input.bandwidth <= 0)
    simpleError(
      "intensities",
      "Aligned intensities and positive bandwidth are required.",
    );
  const estimatedBias = input.intensities.map((x, i) => {
    let weights = 0,
      total = 0;
    for (let j = 0; j < n; j++) {
      const distance = Math.abs(x - input.intensities[j]) / input.bandwidth,
        weight = distance < 1 ? (1 - distance ** 3) ** 3 : 0;
      weights += weight;
      total += weight * input.logRatios[j];
    }
    if (weights === 0)
      simpleError("bandwidth", "At least one local neighbor is required.");
    return total / weights;
  });
  return {
    correctedLogRatios: input.logRatios.map((v, i) => v - estimatedBias[i]),
    estimatedBias,
  };
};

export const exampleInput = {
  intensities: [1, 2, 3],
  logRatios: [2, 0, 2],
  bandwidth: 1,
} satisfies Input;
export const exampleOutput = {
  correctedLogRatios: [0, 0, 0],
  estimatedBias: [2, 0, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/loess-intensity-normalization",
  title: "LOESS Intensity Normalization",
  description:
    "Apply tricube local intensity-bias smoothing to log-ratio signals.",
  inputs: [
    { id: "intensities", kind: "numberList", label: "Intensities" },
    { id: "logRatios", kind: "numberList", label: "Log ratios" },
    { id: "bandwidth", kind: "number", label: "Bandwidth" },
  ],
  outputs: [
    {
      id: "correctedLogRatios",
      kind: "numberList",
      label: "Corrected log ratios",
    },
    { id: "estimatedBias", kind: "numberList", label: "Estimated bias" },
  ],
  calculate: (value) =>
    calculate({
      intensities: value.intensities as readonly number[],
      logRatios: value.logRatios as readonly number[],
      bandwidth: value.bandwidth as number,
    }),
});
export const run = tool.execute;
export default tool;
