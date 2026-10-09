import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sessionCode: string;
  readonly maskingCode: string;
  readonly codebookVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sessionCode: { type: "string", maxLength: 8192, minLength: 1 },
    maskingCode: { type: "string", maxLength: 8192, minLength: 1 },
    codebookVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sessionCode", "maskingCode", "codebookVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record opaque session-masking codes without decoding conditions or certifying blinding. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sessionCode, maskingCode, codebookVersion } = request;
  const compute = (): Output => {
    H.domain(sessionCode.length > 0, "sessionCode");
    H.domain(maskingCode.length > 0, "maskingCode");
    H.domain(codebookVersion.length > 0, "codebookVersion");
    return {
      token: JSON.stringify([sessionCode, maskingCode, codebookVersion]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sessionCode: "S17", maskingCode: "MASK-A", codebookVersion: "v2" },
  output: { token: '["S17","MASK-A","v2"]' },
} satisfies ToolExample<Input, Output>;
export const sessionBlindingCodeLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "experimental-psychology",
        "experimental psychology",
        "psychology",
      ],
      keywords: ["experimental psychology", "psychology"],
    },
    id: "experimental-psychology/session-blinding-code-label",
    title: "Session Blinding Code Label",
    description:
      "Record opaque session-masking codes without decoding conditions or certifying blinding.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sessionCode: { type: "string", maxLength: 8192, minLength: 1 },
        maskingCode: { type: "string", maxLength: 8192, minLength: 1 },
        codebookVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sessionCode", "maskingCode", "codebookVersion"],
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
          id: "sessionCode",
          label: "Session Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "maskingCode",
          label: "Masking Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "codebookVersion",
          label: "Codebook Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = sessionBlindingCodeLabelTool.execute;
export default sessionBlindingCodeLabelTool;
