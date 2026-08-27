import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TransmissivityInput = {
  readonly hydraulicConductivityMS: number;
  readonly aquiferThicknessM: number;
};

export type TransmissivityOutput = {
  readonly transmissivityM2PerS: number;
};

export const calculateTransmissivity = (
  input: TransmissivityInput,
): TransmissivityOutput => {
  if (!(input.aquiferThicknessM > 0))
    simpleError(
      "aquiferThicknessM",
      "Aquifer thickness must be greater than zero.",
      "invalid_thickness",
    );
  if (!(input.hydraulicConductivityMS >= 0))
    simpleError(
      "hydraulicConductivityMS",
      "Hydraulic conductivity must be non-negative.",
      "invalid_conductivity",
    );
  return {
    transmissivityM2PerS:
      input.hydraulicConductivityMS * input.aquiferThicknessM,
  };
};

export const transmissivityExample = {
  input: { hydraulicConductivityMS: 0.0005, aquiferThicknessM: 20 },
  output: { transmissivityM2PerS: 0.01 },
} satisfies ToolExample<TransmissivityInput, TransmissivityOutput>;

export const transmissivityTool = createSimpleTool({
  id: "geology/transmissivity",
  title: "Transmissivity Calculator",
  description:
    "Compute aquifer transmissivity in square meters per second as hydraulic conductivity times saturated aquifer thickness.",
  inputs: [
    {
      description: "Hydraulic conductivity in meters per second.",
      id: "hydraulicConductivityMS",
      kind: "number",
      label: "K",
      minimum: 0,
    },
    {
      description: "Saturated aquifer thickness in meters.",
      id: "aquiferThicknessM",
      kind: "number",
      label: "Thickness",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Transmissivity in square meters per second.",
      id: "transmissivityM2PerS",
      kind: "number",
      label: "T",
    },
  ],
  calculate: (input) =>
    calculateTransmissivity(input as unknown as TransmissivityInput),
});

export const runTransmissivity = transmissivityTool.execute;
export default transmissivityTool;
