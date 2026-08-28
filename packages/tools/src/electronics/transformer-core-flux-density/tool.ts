import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TransformerCoreFluxDensityInput = {
  readonly coreAreaCm2: number;
  readonly frequencyHz: number;
  readonly supplyVolts: number;
  readonly turnsInt: number;
};

export type TransformerCoreFluxDensityOutput = {
  readonly fluxDensityTesla: number;
};

export const transformerCoreFluxDensityExample = {
  input: { coreAreaCm2: 25, frequencyHz: 50, supplyVolts: 230, turnsInt: 400 },
  output: { fluxDensityTesla: 1.036036036036036 },
} satisfies ToolExample<
  TransformerCoreFluxDensityInput,
  TransformerCoreFluxDensityOutput
>;

export const calculateTransformerCoreFluxDensity = (
  input: TransformerCoreFluxDensityInput,
): TransformerCoreFluxDensityOutput => {
  if (!(input.supplyVolts > 0))
    simpleError(
      "supplyVolts",
      "Supply voltage must be positive.",
      "invalid_voltage",
    );
  if (!(input.frequencyHz > 0))
    simpleError(
      "frequencyHz",
      "Frequency must be positive.",
      "invalid_frequency",
    );
  if (!(input.coreAreaCm2 > 0))
    simpleError(
      "coreAreaCm2",
      "Core cross-sectional area must be positive.",
      "invalid_area",
    );
  if (!Number.isSafeInteger(input.turnsInt) || input.turnsInt < 1)
    simpleError(
      "turnsInt",
      "Turns must be an integer of at least one.",
      "invalid_turns",
    );
  return {
    fluxDensityTesla:
      (input.supplyVolts * 1e4) /
      (4.44 * input.frequencyHz * input.coreAreaCm2 * input.turnsInt),
  };
};

export const transformerCoreFluxDensityTool = createSimpleTool({
  calculate: (input) =>
    calculateTransformerCoreFluxDensity(
      input as unknown as TransformerCoreFluxDensityInput,
    ),
  description:
    "Estimate the peak core flux density in tesla with the transformer equation B = V * 10^4 / (4.44 * f * A * N) using a core area in square centimeters.",
  id: "electronics/transformer-core-flux-density",
  inputs: [
    {
      description: "RMS sinusoidal supply voltage.",
      id: "supplyVolts",
      kind: "number",
      label: "Supply voltage",
      unit: "V",
    },
    {
      description: "Supply frequency in hertz.",
      id: "frequencyHz",
      kind: "number",
      label: "Frequency",
      unit: "Hz",
    },
    {
      description: "Core cross-sectional area in square centimeters.",
      id: "coreAreaCm2",
      kind: "number",
      label: "Core area",
      unit: "cm²",
    },
    {
      description: "Number of primary turns.",
      id: "turnsInt",
      kind: "integer",
      label: "Turns",
    },
  ],
  outputs: [
    {
      description: "Peak flux density in the core.",
      id: "fluxDensityTesla",
      kind: "number",
      label: "Flux density",
      unit: "T",
    },
  ],
  title: "Core Flux Density",
});
export const runTransformerCoreFluxDensity =
  transformerCoreFluxDensityTool.execute;
export default transformerCoreFluxDensityTool;
