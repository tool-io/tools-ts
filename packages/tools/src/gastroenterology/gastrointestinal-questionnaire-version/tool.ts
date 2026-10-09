import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly questionnaireId: string;
  readonly version: string;
  readonly languageCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    questionnaireId: { type: "string", maxLength: 8192, minLength: 1 },
    version: { type: "string", maxLength: 8192, minLength: 1 },
    languageCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["questionnaireId", "version", "languageCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Identify an explicit gastrointestinal questionnaire version and language code without validating a translation or scoring. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { questionnaireId, version, languageCode } = request;
  const compute = (): Output => {
    H.domain(questionnaireId.length > 0, "questionnaireId");
    H.domain(version.length > 0, "version");
    H.domain(languageCode.length > 0, "languageCode");
    return { token: JSON.stringify([questionnaireId, version, languageCode]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { questionnaireId: "GI17", version: "v2", languageCode: "en" },
  output: { token: '["GI17","v2","en"]' },
} satisfies ToolExample<Input, Output>;
export const gastrointestinalQuestionnaireVersionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["gastroenterology", "health and medicine"],
        keywords: ["gastroenterology", "health and medicine"],
      },
      id: "gastroenterology/gastrointestinal-questionnaire-version",
      title: "Gastrointestinal Questionnaire Version",
      description:
        "Identify an explicit gastrointestinal questionnaire version and language code without validating a translation or scoring.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          questionnaireId: { type: "string", maxLength: 8192, minLength: 1 },
          version: { type: "string", maxLength: 8192, minLength: 1 },
          languageCode: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["questionnaireId", "version", "languageCode"],
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
            id: "questionnaireId",
            label: "Questionnaire Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "version",
            label: "Version",
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
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = gastrointestinalQuestionnaireVersionTool.execute;
export default gastrointestinalQuestionnaireVersionTool;
