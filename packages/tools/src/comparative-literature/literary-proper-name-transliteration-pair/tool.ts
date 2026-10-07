import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly witnessId: string;
  readonly originalName: string;
  readonly suppliedTransliteration: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    witnessId: { type: "string", maxLength: 8192, minLength: 1 },
    originalName: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedTransliteration: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["witnessId", "originalName", "suppliedTransliteration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an original proper name and supplied transliteration with the witness identifier without selecting a romanization system. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { witnessId, originalName, suppliedTransliteration } = request;
  const compute = (): Output => {
    H.domain(witnessId.length > 0, "witnessId");
    H.domain(originalName.length > 0, "originalName");
    H.domain(suppliedTransliteration.length > 0, "suppliedTransliteration");
    return {
      token: JSON.stringify([witnessId, originalName, suppliedTransliteration]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    witnessId: "W17",
    originalName: "李白",
    suppliedTransliteration: "Li Bai",
  },
  output: { token: '["W17","李白","Li Bai"]' },
} satisfies ToolExample<Input, Output>;
export const literaryProperNameTransliterationPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: [
          "comparative-literature",
          "comparative literature",
          "humanities",
        ],
        keywords: ["comparative literature", "humanities"],
      },
      id: "comparative-literature/literary-proper-name-transliteration-pair",
      title: "Literary Proper Name Transliteration Pair",
      description:
        "Preserve an original proper name and supplied transliteration with the witness identifier without selecting a romanization system.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          witnessId: { type: "string", maxLength: 8192, minLength: 1 },
          originalName: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedTransliteration: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
        },
        required: ["witnessId", "originalName", "suppliedTransliteration"],
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
            id: "witnessId",
            label: "Witness Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "originalName",
            label: "Original Name",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedTransliteration",
            label: "Supplied Transliteration",
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
export const run = literaryProperNameTransliterationPairTool.execute;
export default literaryProperNameTransliterationPairTool;
