import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly editionId: string;
  readonly normalizedFeature: string;
  readonly disclosureNote: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    editionId: { type: "string", maxLength: 8192, minLength: 1 },
    normalizedFeature: { type: "string", maxLength: 8192, minLength: 1 },
    disclosureNote: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["editionId", "normalizedFeature", "disclosureNote"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit editorial normalization disclosure without modifying or reconstructing source text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { editionId, normalizedFeature, disclosureNote } = request;
  const compute = (): Output => {
    H.domain(editionId.length > 0, "editionId");
    H.domain(normalizedFeature.length > 0, "normalizedFeature");
    H.domain(disclosureNote.length > 0, "disclosureNote");
    return {
      token: JSON.stringify([editionId, normalizedFeature, disclosureNote]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    editionId: "E17",
    normalizedFeature: "spelling",
    disclosureNote: "modernized by editor",
  },
  output: { token: '["E17","spelling","modernized by editor"]' },
} satisfies ToolExample<Input, Output>;
export const editorialNormalizationDisclosureTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["critical-theory", "critical theory", "humanities"],
        keywords: ["critical theory", "humanities"],
      },
      id: "critical-theory/editorial-normalization-disclosure-tag",
      title: "Editorial Normalization Disclosure Tag",
      description:
        "Record an explicit editorial normalization disclosure without modifying or reconstructing source text.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          editionId: { type: "string", maxLength: 8192, minLength: 1 },
          normalizedFeature: { type: "string", maxLength: 8192, minLength: 1 },
          disclosureNote: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["editionId", "normalizedFeature", "disclosureNote"],
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
            id: "editionId",
            label: "Edition Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "normalizedFeature",
            label: "Normalized Feature",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "disclosureNote",
            label: "Disclosure Note",
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
export const run = editorialNormalizationDisclosureTagTool.execute;
export default editorialNormalizationDisclosureTagTool;
