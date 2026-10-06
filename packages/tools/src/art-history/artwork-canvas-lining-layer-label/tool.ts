import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly objectId: string;
  readonly liningLayerWording: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    objectId: { type: "string", maxLength: 8192, minLength: 1 },
    liningLayerWording: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["objectId", "liningLayerWording", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit canvas lining-layer description and source without identifying materials or condition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { objectId, liningLayerWording, source } = request;
  const compute = (): Output => {
    H.domain(objectId.length > 0, "objectId");
    H.domain(liningLayerWording.length > 0, "liningLayerWording");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([objectId, liningLayerWording, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    objectId: "OBJ17",
    liningLayerWording: "lining recorded",
    source: "Conservation note",
  },
  output: { token: '["OBJ17","lining recorded","Conservation note"]' },
} satisfies ToolExample<Input, Output>;
export const artworkCanvasLiningLayerLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["art-history", "art history", "arts and design"],
      keywords: ["art history", "arts and design"],
    },
    id: "art-history/artwork-canvas-lining-layer-label",
    title: "Artwork Canvas Lining Layer Label",
    description:
      "Preserve an explicit canvas lining-layer description and source without identifying materials or condition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        objectId: { type: "string", maxLength: 8192, minLength: 1 },
        liningLayerWording: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["objectId", "liningLayerWording", "source"],
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
          id: "objectId",
          label: "Object Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "liningLayerWording",
          label: "Lining Layer Wording",
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
export const run = artworkCanvasLiningLayerLabelTool.execute;
export default artworkCanvasLiningLayerLabelTool;
