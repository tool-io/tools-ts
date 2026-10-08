import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly manuscriptId: string;
  readonly signatureText: string;
  readonly sourceLocator: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    manuscriptId: { type: "string", maxLength: 8192, minLength: 1 },
    signatureText: { type: "string", maxLength: 8192, minLength: 1 },
    sourceLocator: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["manuscriptId", "signatureText", "sourceLocator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit manuscript quire-signature transcription and source locator without reconstructing collation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { manuscriptId, signatureText, sourceLocator } = request;
  const compute = (): Output => {
    H.domain(manuscriptId.length > 0, "manuscriptId");
    H.domain(signatureText.length > 0, "signatureText");
    H.domain(sourceLocator.length > 0, "sourceLocator");
    return {
      token: JSON.stringify([manuscriptId, signatureText, sourceLocator]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    manuscriptId: "MS17",
    signatureText: "a ii",
    sourceLocator: "folio 2r",
  },
  output: { token: '["MS17","a ii","folio 2r"]' },
} satisfies ToolExample<Input, Output>;
export const manuscriptQuireSignatureSourceTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "digital-humanities/manuscript-quire-signature-source-token",
      title: "Manuscript Quire Signature Source Token Tool",
      description:
        "Preserve explicit manuscript quire-signature transcription and source locator without reconstructing collation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          manuscriptId: { type: "string", maxLength: 8192, minLength: 1 },
          signatureText: { type: "string", maxLength: 8192, minLength: 1 },
          sourceLocator: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["manuscriptId", "signatureText", "sourceLocator"],
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
            id: "signatureText",
            label: "Signature Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "sourceLocator",
            label: "Source Locator",
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
export const run = manuscriptQuireSignatureSourceTokenTool.execute;
export default manuscriptQuireSignatureSourceTokenTool;
