import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly spectralIntensities: readonly number[];
  readonly minimumPeakIntensity: number;
  readonly maximumExpectedPeakCount: number;
}>;
export type Output = Readonly<{
  readonly detectedPeakCount: number;
  readonly splittingArtifact: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.spectralIntensities.length < 3)
    simpleError(
      "spectralIntensities",
      "At least three spectral samples are required.",
      "insufficient_samples",
    );
  let detectedPeakCount = 0;
  for (let i = 1; i < input.spectralIntensities.length - 1; i += 1)
    if (
      input.spectralIntensities[i] >= input.minimumPeakIntensity &&
      input.spectralIntensities[i] > input.spectralIntensities[i - 1] &&
      input.spectralIntensities[i] > input.spectralIntensities[i + 1]
    )
      detectedPeakCount += 1;
  return {
    detectedPeakCount,
    splittingArtifact: detectedPeakCount > input.maximumExpectedPeakCount,
  };
};

export const exampleInput = {
  spectralIntensities: [0, 3, 0, 4, 0],
  minimumPeakIntensity: 2,
  maximumExpectedPeakCount: 1,
} satisfies Input;
export const exampleOutput = {
  detectedPeakCount: 2,
  splittingArtifact: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      spectralIntensities: input.spectralIntensities as readonly number[],
      minimumPeakIntensity: input.minimumPeakIntensity as number,
      maximumExpectedPeakCount: input.maximumExpectedPeakCount as number,
    }),
  description:
    "Count significant local spectral peaks and flag excess splitting.",
  id: "laser/wavebreaking-artifact-screen",
  inputs: [
    {
      id: "spectralIntensities",
      label: "Spectral intensity samples",
      kind: "numberList",
    },
    {
      id: "minimumPeakIntensity",
      label: "Minimum peak intensity",
      kind: "number",
      minimum: 0,
    },
    {
      id: "maximumExpectedPeakCount",
      label: "Maximum expected peaks",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "detectedPeakCount",
      label: "Detected local peaks",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "splittingArtifact",
      label: "Splitting artifact flag",
      kind: "boolean",
    },
  ],
  title: "Wavebreaking Artifact Screen",
});

export const run = tool.execute;
export default tool;
