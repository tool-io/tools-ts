import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ShotNoiseVoltageInput = {
  readonly averageCurrentAmps: number;
  readonly bandwidthHz: number;
  readonly loadResistanceOhms: number;
};

export type ShotNoiseVoltageOutput = {
  readonly shotNoiseVoltageUv: number;
};

export const shotNoiseVoltageExample = {
  input: {
    averageCurrentAmps: 0.001,
    bandwidthHz: 1000000,
    loadResistanceOhms: 50,
  },
  output: { shotNoiseVoltageUv: 0.8950353719267188 },
} satisfies ToolExample<ShotNoiseVoltageInput, ShotNoiseVoltageOutput>;

export const calculateShotNoiseVoltage = (
  input: ShotNoiseVoltageInput,
): ShotNoiseVoltageOutput => {
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
  if (!(input.loadResistanceOhms > 0))
    simpleError(
      "loadResistanceOhms",
      "Load resistance must be positive.",
      "invalid_resistance",
    );
  return {
    shotNoiseVoltageUv:
      Math.sqrt(
        2 * 1.602176634e-19 * input.averageCurrentAmps * input.bandwidthHz,
      ) *
      input.loadResistanceOhms *
      1e6,
  };
};

export const shotNoiseVoltageTool = createSimpleTool({
  calculate: (input) =>
    calculateShotNoiseVoltage(input as unknown as ShotNoiseVoltageInput),
  description:
    "Compute rms shot noise voltage across a load in microvolts as sqrt(2 x q x I x B) x R with q = 1.602176634e-19 C.",
  id: "electronics/shot-noise-voltage",
  inputs: [
    {
      id: "averageCurrentAmps",
      kind: "number",
      label: "Average current",
      unit: "A",
    },
    { id: "bandwidthHz", kind: "number", label: "Bandwidth", unit: "Hz" },
    {
      id: "loadResistanceOhms",
      kind: "number",
      label: "Load resistance",
      unit: "Ω",
    },
  ],
  outputs: [
    {
      id: "shotNoiseVoltageUv",
      kind: "number",
      label: "Shot noise voltage",
      unit: "µV",
    },
  ],
  title: "Shot Noise Voltage",
});
export const runShotNoiseVoltage = shotNoiseVoltageTool.execute;
export default shotNoiseVoltageTool;
