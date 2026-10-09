import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly signatureMeaningCode: string;
  readonly codeSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    signatureMeaningCode: { type: "string", maxLength: 8192, minLength: 1 },
    codeSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "signatureMeaningCode", "codeSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit electronic-signature meaning code by source without authenticating a signature. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, signatureMeaningCode, codeSource } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(signatureMeaningCode.length > 0, "signatureMeaningCode");
    H.domain(codeSource.length > 0, "codeSource");
    return {
      token: JSON.stringify([recordId, signatureMeaningCode, codeSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    signatureMeaningCode: "reviewed",
    codeSource: "System key A",
  },
  output: { token: '["R17","reviewed","System key A"]' },
} satisfies ToolExample<Input, Output>;
export const gmpElectronicSignatureMeaningCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "gmp",
        "good manufacturing practice",
        "research and quality management",
      ],
      keywords: [
        "good manufacturing practice",
        "research and quality management",
        "GMP",
      ],
    },
    id: "gmp/gmp-electronic-signature-meaning-code",
    title: "GMP Electronic Signature Meaning Code",
    description:
      "Qualify an explicit electronic-signature meaning code by source without authenticating a signature.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        signatureMeaningCode: { type: "string", maxLength: 8192, minLength: 1 },
        codeSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "signatureMeaningCode", "codeSource"],
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
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "signatureMeaningCode",
          label: "Signature Meaning Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "codeSource",
          label: "Code Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = gmpElectronicSignatureMeaningCodeTool.execute;
export default gmpElectronicSignatureMeaningCodeTool;
