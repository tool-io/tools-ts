import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plantRecordId: string;
  readonly layerWording: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plantRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    layerWording: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["plantRecordId", "layerWording", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit tree-guild layer label by source without asserting plant compatibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plantRecordId, layerWording, source } = request;
  const compute = (): Output => {
    H.domain(plantRecordId.length > 0, "plantRecordId");
    H.domain(layerWording.length > 0, "layerWording");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([plantRecordId, layerWording, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { plantRecordId: "P17", layerWording: "understory", source: "Plan A" },
  output: { token: '["P17","understory","Plan A"]' },
} satisfies ToolExample<Input, Output>;
export const treeGuildLayerSourceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["permaculture", "agriculture"],
      keywords: ["permaculture", "agriculture"],
    },
    id: "permaculture/tree-guild-layer-source-label",
    title: "Tree Guild Layer Source Label",
    description:
      "Qualify an explicit tree-guild layer label by source without asserting plant compatibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plantRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        layerWording: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["plantRecordId", "layerWording", "source"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "plantRecordId",
          label: "Plant Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "layerWording",
          label: "Layer Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = treeGuildLayerSourceLabelTool.execute;
export default treeGuildLayerSourceLabelTool;
