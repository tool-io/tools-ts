import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OxygenIsotopePaleotemperatureInput = {
  readonly calciteDelta18OPerMil: number;
  readonly waterDelta18OPerMil: number;
};

export type OxygenIsotopePaleotemperatureOutput = {
  readonly temperatureC: number;
};

/**
 * Epstein et al. (1953) calcite-water paleotemperature equation as
 * modified by Craig (1965): T = 16.9 - 4.2*D + 0.13*D^2 with
 * D = delta-18O(calcite) - delta-18O(water), both in permil.
 */
export const calculateOxygenIsotopePaleotemperature = (
  input: OxygenIsotopePaleotemperatureInput,
): OxygenIsotopePaleotemperatureOutput => {
  if (!Number.isFinite(input.calciteDelta18OPerMil))
    return simpleError(
      "calciteDelta18OPerMil",
      "The calcite delta value must be finite.",
      "invalid_delta",
    );
  if (!Number.isFinite(input.waterDelta18OPerMil))
    return simpleError(
      "waterDelta18OPerMil",
      "The water delta value must be finite.",
      "invalid_delta",
    );
  const difference = input.calciteDelta18OPerMil - input.waterDelta18OPerMil;
  return {
    temperatureC: 16.9 - 4.2 * difference + 0.13 * difference * difference,
  };
};

export const oxygenIsotopePaleotemperatureExample = {
  input: { calciteDelta18OPerMil: -1.5, waterDelta18OPerMil: -1 },
  output: { temperatureC: 19.0325 },
} satisfies ToolExample<
  OxygenIsotopePaleotemperatureInput,
  OxygenIsotopePaleotemperatureOutput
>;

export const oxygenIsotopePaleotemperatureTool = createSimpleTool({
  id: "geology/oxygen-isotope-paleotemperature",
  title: "Geology Oxygen Isotope Paleotemperature Calculator",
  description:
    "Estimate carbonate formation temperature from calcite and water delta-18O values using the Epstein-Craig paleotemperature equation.",
  inputs: [
    {
      description: "Delta-18O of calcite in permil (PDB scale).",
      id: "calciteDelta18OPerMil",
      kind: "number",
      label: "Calcite d18O",
    },
    {
      description: "Delta-18O of the ambient water in permil (SMOW scale).",
      id: "waterDelta18OPerMil",
      kind: "number",
      label: "Water d18O",
    },
  ],
  outputs: [
    {
      description: "Calcification temperature in degrees Celsius.",
      id: "temperatureC",
      kind: "number",
      label: "Temperature (C)",
    },
  ],
  calculate: (input) =>
    calculateOxygenIsotopePaleotemperature(
      input as unknown as OxygenIsotopePaleotemperatureInput,
    ),
});

export const runOxygenIsotopePaleotemperature =
  oxygenIsotopePaleotemperatureTool.execute;
export default oxygenIsotopePaleotemperatureTool;
