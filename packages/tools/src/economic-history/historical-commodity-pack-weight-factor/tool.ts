import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly packCount: number;
  readonly massPerHistoricalPack: number;
};
export type Output = { readonly totalMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    packCount: { type: "number", minimum: 0 },
    massPerHistoricalPack: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["packCount", "massPerHistoricalPack"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { totalMass: { type: "number" } },
  required: ["totalMass"],
} as const;
/** Extend a historical commodity pack count using an explicitly sourced mass-per-pack factor without assigning a universal historical pack size. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { packCount, massPerHistoricalPack } = request;
  const compute = (): Output => {
    H.domain(packCount >= 0, "packCount");
    (H.domain(massPerHistoricalPack > 0, "massPerHistoricalPack"),
      massPerHistoricalPack);
    return { totalMass: packCount * massPerHistoricalPack };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { packCount: 12, massPerHistoricalPack: 25 },
  output: { totalMass: 300 },
} satisfies ToolExample<Input, Output>;
export const historicalCommodityPackWeightFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["economic-history", "economic history", "economics"],
        keywords: ["economic history", "economics"],
      },
      id: "economic-history/historical-commodity-pack-weight-factor",
      title: "Historical Commodity Pack Weight Factor",
      description:
        "Extend a historical commodity pack count using an explicitly sourced mass-per-pack factor without assigning a universal historical pack size.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          packCount: { type: "number", minimum: 0 },
          massPerHistoricalPack: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["packCount", "massPerHistoricalPack"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { totalMass: { type: "number" } },
        required: ["totalMass"],
      },
      ports: {
        inputs: [
          {
            id: "packCount",
            label: "Pack Count",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "massPerHistoricalPack",
            label: "Mass Per Historical Pack",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "totalMass",
            label: "Total Mass",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = historicalCommodityPackWeightFactorTool.execute;
export default historicalCommodityPackWeightFactorTool;
