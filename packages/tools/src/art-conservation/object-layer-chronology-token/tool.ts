import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly objectId: string;
  readonly layerIds: readonly string[];
  readonly olderToYounger: boolean;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    objectId: { type: "string", maxLength: 8192, minLength: 1 },
    layerIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    olderToYounger: { type: "boolean" },
  },
  required: ["objectId", "layerIds", "olderToYounger"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode an explicitly supplied ordered layer sequence and its direction without inferring stratigraphic chronology. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { objectId, layerIds, olderToYounger } = request;
  const compute = (): Output => {
    H.domain(
      objectId.length > 0 &&
        new Set(layerIds).size === layerIds.length &&
        layerIds.every((v) => v.length > 0),
      "objectId",
    );
    return {
      token: JSON.stringify([
        objectId,
        olderToYounger ? "older-to-younger" : "younger-to-older",
        layerIds,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { objectId: "O17", layerIds: ["L1", "L2"], olderToYounger: true },
  output: { token: '["O17","older-to-younger",["L1","L2"]]' },
} satisfies ToolExample<Input, Output>;
export const objectLayerChronologyTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["art-conservation", "art conservation", "arts and design"],
      keywords: ["art conservation", "arts and design"],
    },
    id: "art-conservation/object-layer-chronology-token",
    title: "Object Layer Chronology Token",
    description:
      "Encode an explicitly supplied ordered layer sequence and its direction without inferring stratigraphic chronology.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        objectId: { type: "string", maxLength: 8192, minLength: 1 },
        layerIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        olderToYounger: { type: "boolean" },
      },
      required: ["objectId", "layerIds", "olderToYounger"],
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
          id: "layerIds",
          label: "Layer Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "olderToYounger",
          label: "Older To Younger",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = objectLayerChronologyTokenTool.execute;
export default objectLayerChronologyTokenTool;
