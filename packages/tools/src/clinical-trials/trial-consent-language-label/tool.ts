import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly trialId: string;
  readonly consentVersion: string;
  readonly languageCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trialId: { type: "string", maxLength: 8192, minLength: 1 },
    consentVersion: { type: "string", maxLength: 8192, minLength: 1 },
    languageCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["trialId", "consentVersion", "languageCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit trial-consent version by supplied language code without assessing translation or consent validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { trialId, consentVersion, languageCode } = request;
  const compute = (): Output => {
    H.domain(trialId.length > 0, "trialId");
    H.domain(consentVersion.length > 0, "consentVersion");
    H.domain(languageCode.length > 0, "languageCode");
    return { token: JSON.stringify([trialId, consentVersion, languageCode]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { trialId: "TR17", consentVersion: "v2", languageCode: "es" },
  output: { token: '["TR17","v2","es"]' },
} satisfies ToolExample<Input, Output>;
export const trialConsentLanguageLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "clinical-trials",
        "clinical trials",
        "research and quality management",
      ],
      keywords: ["clinical trials", "research and quality management"],
    },
    id: "clinical-trials/trial-consent-language-label",
    title: "Trial Consent Language Label",
    description:
      "Qualify an explicit trial-consent version by supplied language code without assessing translation or consent validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trialId: { type: "string", maxLength: 8192, minLength: 1 },
        consentVersion: { type: "string", maxLength: 8192, minLength: 1 },
        languageCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["trialId", "consentVersion", "languageCode"],
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
          id: "trialId",
          label: "Trial Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "consentVersion",
          label: "Consent Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "languageCode",
          label: "Language Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = trialConsentLanguageLabelTool.execute;
export default trialConsentLanguageLabelTool;
