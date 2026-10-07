import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly glossToken: string;
  readonly suppliedExpansion: string;
  readonly sourceId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    glossToken: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedExpansion: { type: "string", maxLength: 8192, minLength: 1 },
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["glossToken", "suppliedExpansion", "sourceId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit gloss abbreviation, supplied expansion and source without inventing a universal gloss vocabulary. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { glossToken, suppliedExpansion, sourceId } = request;
  const compute = (): Output => {
    H.domain(glossToken.length > 0, "glossToken");
    H.domain(suppliedExpansion.length > 0, "suppliedExpansion");
    H.domain(sourceId.length > 0, "sourceId");
    return { token: JSON.stringify([glossToken, suppliedExpansion, sourceId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { glossToken: "PST", suppliedExpansion: "past", sourceId: "G4" },
  output: { token: '["PST","past","G4"]' },
} satisfies ToolExample<Input, Output>;
export const morphologicalGlossAbbreviationSourceRowTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: [
          "computational-linguistics",
          "computational linguistics",
          "information and language sciences",
        ],
        keywords: [
          "computational linguistics",
          "information and language sciences",
        ],
      },
      id: "computational-linguistics/morphological-gloss-abbreviation-source-row",
      title: "Morphological Gloss Abbreviation Source Row",
      description:
        "Preserve an explicit gloss abbreviation, supplied expansion and source without inventing a universal gloss vocabulary.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          glossToken: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedExpansion: { type: "string", maxLength: 8192, minLength: 1 },
          sourceId: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["glossToken", "suppliedExpansion", "sourceId"],
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
            id: "glossToken",
            label: "Gloss Token",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedExpansion",
            label: "Supplied Expansion",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "sourceId",
            label: "Source Id",
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
export const run = morphologicalGlossAbbreviationSourceRowTool.execute;
export default morphologicalGlossAbbreviationSourceRowTool;
