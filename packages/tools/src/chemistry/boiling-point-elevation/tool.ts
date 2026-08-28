import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BoilingPointElevationInput = {
  readonly kbCkgPerMol?: number;
  readonly molality: number;
  readonly vantHoffFactor?: number;
};

export type BoilingPointElevationOutput = {
  readonly boilingPointRiseCelsius: number;
};

export const boilingPointElevationExample = {
  input: { kbCkgPerMol: 0.512, molality: 2 },
  output: { boilingPointRiseCelsius: 1.024 },
} satisfies ToolExample<
  BoilingPointElevationInput,
  BoilingPointElevationOutput
>;

export const boilingPointElevationTool = createSimpleTool({
  id: "chemistry/boiling-point-elevation",
  title: "Boiling Point Elevation",
  description:
    "Estimate boiling point elevation from molality, the ebullioscopic constant, and the van 't Hoff factor.",
  inputs: [
    {
      default: 0.512,
      id: "kbCkgPerMol",
      kind: "number",
      label: "Ebullioscopic constant",
      unit: "°C·kg/mol",
    },
    {
      id: "molality",
      kind: "number",
      label: "Molality",
      minimum: 0,
      unit: "mol/kg",
    },
    {
      default: 1,
      id: "vantHoffFactor",
      kind: "integer",
      label: "van 't Hoff factor",
      maximum: 5,
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "boilingPointRiseCelsius",
      kind: "number",
      label: "Boiling point rise",
      unit: "°C",
    },
  ],
  calculate: (input) => {
    const kbCkgPerMol = input.kbCkgPerMol as number;
    const molality = input.molality as number;
    const vantHoffFactor = input.vantHoffFactor as number;
    if (!(kbCkgPerMol > 0))
      simpleError(
        "kbCkgPerMol",
        "The ebullioscopic constant must be greater than zero.",
        "invalid_constant",
      );
    return {
      boilingPointRiseCelsius: vantHoffFactor * kbCkgPerMol * molality,
    };
  },
});
export const runBoilingPointElevation = boilingPointElevationTool.execute;
export default boilingPointElevationTool;
