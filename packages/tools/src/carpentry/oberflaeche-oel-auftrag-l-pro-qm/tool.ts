import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OilCoverageInput = {
  readonly areaM2: number;
  readonly coatCount?: number;
  readonly consumptionLPerM2PerCoat?: number;
};

export type OilCoverageOutput = {
  readonly oilLiters: number;
};

export const oilCoverageExample = {
  input: { areaM2: 24, coatCount: 2, consumptionLPerM2PerCoat: 0.125 },
  output: { oilLiters: 6 },
} satisfies ToolExample<OilCoverageInput, OilCoverageOutput>;

export const oilCoverageTool = createSimpleTool({
  id: "carpentry/oberflaeche-oel-auftrag-l-pro-qm",
  title: "Oil Coverage Calculator",
  description:
    "Calculate the oil quantity in liters for a surface area, number of coats, and consumption per coat.",
  inputs: [
    { id: "areaM2", kind: "number", label: "Surface area", unit: "m²" },
    {
      default: 2,
      description: "Number of oil coats to apply.",
      id: "coatCount",
      kind: "integer",
      label: "Coat count",
      minimum: 1,
    },
    {
      default: 0.1,
      description: "Oil consumption per square meter and coat.",
      id: "consumptionLPerM2PerCoat",
      kind: "number",
      label: "Consumption",
      unit: "l/m²",
    },
  ],
  outputs: [
    { id: "oilLiters", kind: "number", label: "Oil quantity", unit: "l" },
  ],
  calculate: (input) => {
    const areaM2 = input.areaM2 as number;
    const coatCount = input.coatCount as number;
    const consumptionLPerM2PerCoat = input.consumptionLPerM2PerCoat as number;
    if (!(areaM2 > 0))
      simpleError(
        "areaM2",
        "Surface area must be greater than zero.",
        "invalid_area",
      );
    if (!(consumptionLPerM2PerCoat > 0))
      simpleError(
        "consumptionLPerM2PerCoat",
        "Consumption must be greater than zero.",
        "invalid_consumption",
      );
    return { oilLiters: areaM2 * coatCount * consumptionLPerM2PerCoat };
  },
});
export const runOilCoverage = oilCoverageTool.execute;
export default oilCoverageTool;
