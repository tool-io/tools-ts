import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly manuscriptId: string;
  readonly folioReference: string;
  readonly suppliedCatchword: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    manuscriptId: { type: "string", maxLength: 8192, minLength: 1 },
    folioReference: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedCatchword: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["manuscriptId", "folioReference", "suppliedCatchword"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit manuscript catchword transcription by folio without verifying textual continuity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { manuscriptId, folioReference, suppliedCatchword } = request;
  const compute = (): Output => {
    H.domain(manuscriptId.length > 0, "manuscriptId");
    H.domain(folioReference.length > 0, "folioReference");
    H.domain(suppliedCatchword.length > 0, "suppliedCatchword");
    return {
      token: JSON.stringify([manuscriptId, folioReference, suppliedCatchword]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    manuscriptId: "MS17",
    folioReference: "3v",
    suppliedCatchword: "word A",
  },
  output: { token: '["MS17","3v","word A"]' },
} satisfies ToolExample<Input, Output>;
export const southasianManuscriptCatchwordLinkTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["asian-studies", "asian studies", "humanities"],
        keywords: ["asian studies", "humanities"],
      },
      id: "asian-studies/south-asian-manuscript-catchword-link-token",
      title: "South Asian Manuscript Catchword Link Token",
      description:
        "Qualify an explicit manuscript catchword transcription by folio without verifying textual continuity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          manuscriptId: { type: "string", maxLength: 8192, minLength: 1 },
          folioReference: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedCatchword: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["manuscriptId", "folioReference", "suppliedCatchword"],
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
            id: "manuscriptId",
            label: "Manuscript Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "folioReference",
            label: "Folio Reference",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedCatchword",
            label: "Supplied Catchword",
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
export const run = southasianManuscriptCatchwordLinkTokenTool.execute;
export default southasianManuscriptCatchwordLinkTokenTool;
