import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VantHoffTemperatureInput = {
  readonly deltaHJPerMol: number;
  readonly deltaSJPerMolK: number;
};

export type VantHoffTemperatureOutput = {
  readonly transitionTemperatureKelvin: number;
};

export const vantHoffTemperatureExample = {
  input: { deltaHJPerMol: 50000, deltaSJPerMolK: 100 },
  output: { transitionTemperatureKelvin: 500 },
} satisfies ToolExample<VantHoffTemperatureInput, VantHoffTemperatureOutput>;

export const vantHoffTemperatureTool = createSimpleTool({
  id: "chemistry/vant-hoff-temperature",
  title: "Van't Hoff Transition Temperature",
  description:
    "Compute the Van't Hoff transition temperature as the ratio of enthalpy and entropy changes.",
  inputs: [
    {
      id: "deltaHJPerMol",
      label: "Enthalpy change",
      kind: "number",
      unit: "J/mol",
    },
    {
      id: "deltaSJPerMolK",
      label: "Entropy change",
      kind: "number",
      unit: "J/(mol·K)",
    },
  ],
  outputs: [
    {
      id: "transitionTemperatureKelvin",
      label: "Transition temperature",
      kind: "number",
      unit: "K",
    },
  ],
  calculate: (input) => {
    const deltaHJPerMol = input.deltaHJPerMol as number;
    const deltaSJPerMolK = input.deltaSJPerMolK as number;
    if (deltaHJPerMol === 0)
      simpleError("deltaHJPerMol", "Enthalpy change must be non-zero.");
    if (deltaSJPerMolK === 0)
      simpleError("deltaSJPerMolK", "Entropy change must be non-zero.");
    if (deltaHJPerMol > 0 !== deltaSJPerMolK > 0)
      simpleError(
        "deltaSJPerMolK",
        "Enthalpy and entropy changes must share the same sign.",
        "inconsistent_units",
      );
    return {
      transitionTemperatureKelvin: deltaHJPerMol / deltaSJPerMolK,
    };
  },
});
export const runVantHoffTemperature = vantHoffTemperatureTool.execute;
export default vantHoffTemperatureTool;
