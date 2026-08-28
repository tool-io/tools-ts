import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TotalIntegratedNoiseInput = {
  readonly bandwidthHz: number;
  readonly densityNVPerRootHz: number;
};

export type TotalIntegratedNoiseOutput = {
  readonly integratedNoiseUvRms: number;
};

export const totalIntegratedNoiseExample = {
  input: { bandwidthHz: 4, densityNVPerRootHz: 1 },
  output: { integratedNoiseUvRms: 0.002 },
} satisfies ToolExample<TotalIntegratedNoiseInput, TotalIntegratedNoiseOutput>;

export const calculateTotalIntegratedNoise = (
  input: TotalIntegratedNoiseInput,
): TotalIntegratedNoiseOutput => {
  if (!(input.densityNVPerRootHz > 0))
    simpleError(
      "densityNVPerRootHz",
      "Noise density must be positive.",
      "invalid_density",
    );
  if (!(input.bandwidthHz > 0))
    simpleError(
      "bandwidthHz",
      "Bandwidth must be positive.",
      "invalid_bandwidth",
    );
  return {
    integratedNoiseUvRms:
      (input.densityNVPerRootHz * Math.sqrt(input.bandwidthHz)) / 1000,
  };
};

export const totalIntegratedNoiseTool = createSimpleTool({
  calculate: (input) =>
    calculateTotalIntegratedNoise(
      input as unknown as TotalIntegratedNoiseInput,
    ),
  description:
    "Compute total integrated noise as density x sqrt(bandwidth), expressed in microvolts rms.",
  id: "electronics/total-integrated-noise",
  inputs: [
    { id: "bandwidthHz", kind: "number", label: "Bandwidth", unit: "Hz" },
    {
      id: "densityNVPerRootHz",
      kind: "number",
      label: "Noise density",
      unit: "nV/√Hz",
    },
  ],
  outputs: [
    {
      id: "integratedNoiseUvRms",
      kind: "number",
      label: "Integrated noise",
      unit: "µVrms",
    },
  ],
  title: "Integrated Noise µVrms",
});
export const runTotalIntegratedNoise = totalIntegratedNoiseTool.execute;
export default totalIntegratedNoiseTool;
