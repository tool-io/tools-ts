import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly pixelIntensities: readonly number[];
}>;
export type Output = Readonly<{
  readonly meanIntensity: number;
  readonly standardDeviation: number;
  readonly speckleContrast: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.pixelIntensities.length === 0)
    simpleError(
      "pixelIntensities",
      "At least one pixel is required.",
      "empty_pixels",
    );
  const meanIntensity =
    input.pixelIntensities.reduce((a, b) => a + b, 0) /
    input.pixelIntensities.length;
  if (meanIntensity <= 0)
    simpleError(
      "pixelIntensities",
      "Mean intensity must be positive.",
      "invalid_mean",
    );
  const standardDeviation = Math.sqrt(
    input.pixelIntensities.reduce(
      (sum, value) => sum + (value - meanIntensity) ** 2,
      0,
    ) / input.pixelIntensities.length,
  );
  return {
    meanIntensity,
    standardDeviation,
    speckleContrast: standardDeviation / meanIntensity,
  };
};

export const exampleInput = { pixelIntensities: [0, 2, 0, 2] } satisfies Input;
export const exampleOutput = {
  meanIntensity: 1,
  standardDeviation: 1,
  speckleContrast: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      pixelIntensities: input.pixelIntensities as readonly number[],
    }),
  description:
    "Calculate population speckle contrast from an intensity region.",
  id: "laser/speckle-contrast",
  inputs: [
    {
      id: "pixelIntensities",
      label: "Speckle pixel intensities",
      kind: "numberList",
    },
  ],
  outputs: [
    { id: "meanIntensity", label: "Mean intensity", kind: "number" },
    {
      id: "standardDeviation",
      label: "Population standard deviation",
      kind: "number",
      minimum: 0,
    },
    {
      id: "speckleContrast",
      label: "Speckle contrast",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Speckle Contrast",
});

export const run = tool.execute;
export default tool;
