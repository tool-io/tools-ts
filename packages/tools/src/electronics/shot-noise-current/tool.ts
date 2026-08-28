import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ShotNoiseCurrentInput = {
  readonly averageCurrentAmps: number;
  readonly bandwidthHz: number;
};

export type ShotNoiseCurrentOutput = {
  readonly shotNoiseCurrentA: number;
};

export const shotNoiseCurrentExample = {
  input: { averageCurrentAmps: 0.001, bandwidthHz: 1000000 },
  output: { shotNoiseCurrentA: 1.7900707438534376e-8 },
} satisfies ToolExample<ShotNoiseCurrentInput, ShotNoiseCurrentOutput>;

export const calculateShotNoiseCurrent = (
  input: ShotNoiseCurrentInput,
): ShotNoiseCurrentOutput => {
  if (!(input.averageCurrentAmps > 0))
    simpleError(
      "averageCurrentAmps",
      "Average current must be positive.",
      "invalid_current",
    );
  if (!(input.bandwidthHz > 0))
    simpleError(
      "bandwidthHz",
      "Bandwidth must be positive.",
      "invalid_bandwidth",
    );
  return {
    shotNoiseCurrentA: Math.sqrt(
      2 * 1.602176634e-19 * input.averageCurrentAmps * input.bandwidthHz,
    ),
  };
};

export const shotNoiseCurrentTool = createSimpleTool({
  calculate: (input) =>
    calculateShotNoiseCurrent(input as unknown as ShotNoiseCurrentInput),
  description:
    "Compute rms shot noise current as sqrt(2 x q x I x B) with elementary charge q = 1.602176634e-19 C.",
  id: "electronics/shot-noise-current",
  inputs: [
    {
      id: "averageCurrentAmps",
      kind: "number",
      label: "Average current",
      unit: "A",
    },
    { id: "bandwidthHz", kind: "number", label: "Bandwidth", unit: "Hz" },
  ],
  outputs: [
    {
      id: "shotNoiseCurrentA",
      kind: "number",
      label: "Shot noise current",
      unit: "A",
    },
  ],
  title: "Shot Noise Current",
});
export const runShotNoiseCurrent = shotNoiseCurrentTool.execute;
export default shotNoiseCurrentTool;
