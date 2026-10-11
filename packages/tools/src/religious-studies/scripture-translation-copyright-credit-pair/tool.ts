import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly translationId: string;
  readonly suppliedCreditText: string;
  readonly rightsSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    translationId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedCreditText: { type: "string", maxLength: 8192, minLength: 1 },
    rightsSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["translationId", "suppliedCreditText", "rightsSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit scripture-translation credit and rights source without granting reproduction rights. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { translationId, suppliedCreditText, rightsSource } = request;
  const compute = (): Output => {
    H.domain(translationId.length > 0, "translationId");
    H.domain(suppliedCreditText.length > 0, "suppliedCreditText");
    H.domain(rightsSource.length > 0, "rightsSource");
    return {
      token: JSON.stringify([translationId, suppliedCreditText, rightsSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    translationId: "TR17",
    suppliedCreditText: "Credit A",
    rightsSource: "Rights note A",
  },
  output: { token: '["TR17","Credit A","Rights note A"]' },
} satisfies ToolExample<Input, Output>;
export const scriptureTranslationCopyrightCreditPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["religious-studies", "religious studies", "humanities"],
        keywords: ["religious studies", "humanities"],
      },
      id: "religious-studies/scripture-translation-copyright-credit-pair",
      title: "Scripture Translation Copyright Credit Pair",
      description:
        "Preserve an explicit scripture-translation credit and rights source without granting reproduction rights.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          translationId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedCreditText: { type: "string", maxLength: 8192, minLength: 1 },
          rightsSource: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["translationId", "suppliedCreditText", "rightsSource"],
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
            id: "translationId",
            label: "Translation Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedCreditText",
            label: "Supplied Credit Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "rightsSource",
            label: "Rights Source",
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
export const run = scriptureTranslationCopyrightCreditPairTool.execute;
export default scriptureTranslationCopyrightCreditPairTool;
