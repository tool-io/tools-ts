import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly territorial: number;
  readonly embodiedImports: number;
  readonly embodiedExports: number;
};
export type Output = {
  readonly consumptionBased: number;
  readonly netImportedEmissions: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    territorial: { type: "number", minimum: 0 },
    embodiedImports: { type: "number", minimum: 0 },
    embodiedExports: { type: "number", minimum: 0 },
  },
  required: ["territorial", "embodiedImports", "embodiedExports"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    consumptionBased: { type: "number" },
    netImportedEmissions: { type: "number" },
  },
  required: ["consumptionBased", "netImportedEmissions"],
} as const;
/** Consumption-based accounting bridge using supplied compatible embodied-emissions estimates, not a multiregional input-output calculation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { territorial, embodiedImports, embodiedExports } = request;
  const compute = (): Output => {
    H.domain(territorial >= 0 && embodiedImports >= 0 && embodiedExports >= 0);
    return {
      consumptionBased: territorial + embodiedImports - embodiedExports,
      netImportedEmissions: embodiedImports - embodiedExports,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { territorial: 100, embodiedImports: 30, embodiedExports: 20 },
  output: { consumptionBased: 110, netImportedEmissions: 10 },
} satisfies ToolExample<Input, Output>;
export const globalEmissionTerritorialConsumptionGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "global-studies/global-emission-territorial-consumption-gap",
      title: "Global Emission Territorial Consumption Gap Tool",
      description:
        "Consumption-based accounting bridge using supplied compatible embodied-emissions estimates, not a multiregional input-output calculation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          territorial: { type: "number", minimum: 0 },
          embodiedImports: { type: "number", minimum: 0 },
          embodiedExports: { type: "number", minimum: 0 },
        },
        required: ["territorial", "embodiedImports", "embodiedExports"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          consumptionBased: { type: "number" },
          netImportedEmissions: { type: "number" },
        },
        required: ["consumptionBased", "netImportedEmissions"],
      },
      ports: {
        inputs: [
          {
            id: "territorial",
            label: "Territorial",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "embodiedImports",
            label: "Embodied Imports",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "embodiedExports",
            label: "Embodied Exports",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "consumptionBased",
            label: "Consumption Based",
            valueType: { type: "number" },
          },
          {
            id: "netImportedEmissions",
            label: "Net Imported Emissions",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = globalEmissionTerritorialConsumptionGapTool.execute;
export default globalEmissionTerritorialConsumptionGapTool;
