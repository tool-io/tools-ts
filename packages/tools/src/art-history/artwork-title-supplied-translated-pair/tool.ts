import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly objectId: string;
  readonly originalTitle: string;
  readonly suppliedTranslation: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    objectId: { type: "string", maxLength: 8192, minLength: 1 },
    originalTitle: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedTranslation: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["objectId", "originalTitle", "suppliedTranslation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Pair explicitly supplied original and translated artwork titles without generating a translation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { objectId, originalTitle, suppliedTranslation } = request;
  const compute = (): Output => {
    H.domain(objectId.length > 0, "objectId");
    H.domain(originalTitle.length > 0, "originalTitle");
    H.domain(suppliedTranslation.length > 0, "suppliedTranslation");
    return {
      token: JSON.stringify([objectId, originalTitle, suppliedTranslation]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    objectId: "OBJ17",
    originalTitle: "Titre A",
    suppliedTranslation: "Title A",
  },
  output: { token: '["OBJ17","Titre A","Title A"]' },
} satisfies ToolExample<Input, Output>;
export const artworkTitleSuppliedTranslatedPairTool = H.defineSchemaCalculation<
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
    id: "art-history/artwork-title-supplied-translated-pair",
    title: "Artwork Title Supplied Translated Pair",
    description:
      "Pair explicitly supplied original and translated artwork titles without generating a translation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        objectId: { type: "string", maxLength: 8192, minLength: 1 },
        originalTitle: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedTranslation: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["objectId", "originalTitle", "suppliedTranslation"],
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
          id: "originalTitle",
          label: "Original Title",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedTranslation",
          label: "Supplied Translation",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = artworkTitleSuppliedTranslatedPairTool.execute;
export default artworkTitleSuppliedTranslatedPairTool;
