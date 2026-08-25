import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type ErgosterolBiomassMarkerCalculatorInput = {
  readonly biomassPerErgosterolFactor: number;
  readonly ergosterolUgPerG: number;
};

export type ErgosterolBiomassMarkerCalculatorOutput = {
  readonly fungalBiomassUgPerG: number;
};

export const ergosterolBiomassMarkerCalculatorExample = {
  input: { biomassPerErgosterolFactor: 180, ergosterolUgPerG: 2.4 },
  output: { fungalBiomassUgPerG: 432 },
} satisfies ToolExample<
  ErgosterolBiomassMarkerCalculatorInput,
  ErgosterolBiomassMarkerCalculatorOutput
>;

export const ergosterolBiomassMarkerCalculatorTool = createSimpleTool({
  id: "mycology/ergosterol-biomass-marker-calculator",
  title: "Ergosterol Biomass",
  description:
    "Estimate fungal biomass from ergosterol concentration using a calibration factor supplied for the organism, matrix, extraction, and assay method.",
  inputs: [
    {
      id: "ergosterolUgPerG",
      kind: "number",
      label: "Ergosterol concentration",
      minimum: 0,
      unit: "µg/g",
    },
    {
      id: "biomassPerErgosterolFactor",
      kind: "number",
      label: "Biomass per ergosterol factor",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "fungalBiomassUgPerG",
      kind: "number",
      label: "Fungal biomass",
      minimum: 0,
      unit: "µg/g",
    },
  ],
  calculate: (input) => ({
    fungalBiomassUgPerG:
      (input.ergosterolUgPerG as number) *
      (input.biomassPerErgosterolFactor as number),
  }),
});
export const runErgosterolBiomassMarkerCalculator =
  ergosterolBiomassMarkerCalculatorTool.execute;
export default ergosterolBiomassMarkerCalculatorTool;
