import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly agreementId: string;
  readonly sourceVersion: string;
  readonly translatedVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    agreementId: { type: "string", maxLength: 8192, minLength: 1 },
    sourceVersion: { type: "string", maxLength: 8192, minLength: 1 },
    translatedVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["agreementId", "sourceVersion", "translatedVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Pair explicit agreement and translation version identifiers without generating or authenticating translations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { agreementId, sourceVersion, translatedVersion } = request;
  const compute = (): Output => {
    H.domain(agreementId.length > 0, "agreementId");
    H.domain(sourceVersion.length > 0, "sourceVersion");
    H.domain(translatedVersion.length > 0, "translatedVersion");
    return {
      token: JSON.stringify([agreementId, sourceVersion, translatedVersion]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    agreementId: "AGR17",
    sourceVersion: "v2",
    translatedVersion: "tr-v2",
  },
  output: { token: '["AGR17","v2","tr-v2"]' },
} satisfies ToolExample<Input, Output>;
export const publicAgreementTranslationVersionPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: [
          "international-relations",
          "international relations",
          "social sciences",
        ],
        keywords: ["international relations", "social sciences"],
      },
      id: "international-relations/public-agreement-translation-version-pair",
      title: "Public Agreement Translation Version Pair",
      description:
        "Pair explicit agreement and translation version identifiers without generating or authenticating translations.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          agreementId: { type: "string", maxLength: 8192, minLength: 1 },
          sourceVersion: { type: "string", maxLength: 8192, minLength: 1 },
          translatedVersion: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["agreementId", "sourceVersion", "translatedVersion"],
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
            id: "agreementId",
            label: "Agreement Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "sourceVersion",
            label: "Source Version",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "translatedVersion",
            label: "Translated Version",
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
export const run = publicAgreementTranslationVersionPairTool.execute;
export default publicAgreementTranslationVersionPairTool;
