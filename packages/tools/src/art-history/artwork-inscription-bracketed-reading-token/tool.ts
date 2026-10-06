import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly objectId: string;
  readonly suppliedReading: string;
  readonly editorialConvention: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    objectId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedReading: { type: "string", maxLength: 8192, minLength: 1 },
    editorialConvention: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["objectId", "suppliedReading", "editorialConvention"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit inscription reading and bracket convention without deciphering or restoring text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { objectId, suppliedReading, editorialConvention } = request;
  const compute = (): Output => {
    H.domain(objectId.length > 0, "objectId");
    H.domain(suppliedReading.length > 0, "suppliedReading");
    H.domain(editorialConvention.length > 0, "editorialConvention");
    return {
      token: JSON.stringify([objectId, suppliedReading, editorialConvention]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    objectId: "OBJ17",
    suppliedReading: "[word]",
    editorialConvention: "Editor A",
  },
  output: { token: '["OBJ17","[word]","Editor A"]' },
} satisfies ToolExample<Input, Output>;
export const artworkInscriptionBracketedReadingTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["art-history", "art history", "arts and design"],
        keywords: ["art history", "arts and design"],
      },
      id: "art-history/artwork-inscription-bracketed-reading-token",
      title: "Artwork Inscription Bracketed Reading Token",
      description:
        "Preserve an explicit inscription reading and bracket convention without deciphering or restoring text.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          objectId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedReading: { type: "string", maxLength: 8192, minLength: 1 },
          editorialConvention: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
        },
        required: ["objectId", "suppliedReading", "editorialConvention"],
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
            id: "suppliedReading",
            label: "Supplied Reading",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "editorialConvention",
            label: "Editorial Convention",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = artworkInscriptionBracketedReadingTokenTool.execute;
export default artworkInscriptionBracketedReadingTokenTool;
