import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly interviewId: string;
  readonly languageWording: string;
  readonly permissionReference: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    interviewId: { type: "string", maxLength: 8192, minLength: 1 },
    languageWording: { type: "string", maxLength: 8192, minLength: 1 },
    permissionReference: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["interviewId", "languageWording", "permissionReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit oral-history language label by permission reference without establishing consent validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { interviewId, languageWording, permissionReference } = request;
  const compute = (): Output => {
    H.domain(interviewId.length > 0, "interviewId");
    H.domain(languageWording.length > 0, "languageWording");
    H.domain(permissionReference.length > 0, "permissionReference");
    return {
      token: JSON.stringify([
        interviewId,
        languageWording,
        permissionReference,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    interviewId: "INT17",
    languageWording: "Language A",
    permissionReference: "PERM2",
  },
  output: { token: '["INT17","Language A","PERM2"]' },
} satisfies ToolExample<Input, Output>;
export const africanOralHistoryConsentedLanguageLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["african-studies", "african studies", "humanities"],
        keywords: ["african studies", "humanities"],
      },
      id: "african-studies/african-oral-history-consented-language-label",
      title: "African Oral History Consented Language Label",
      description:
        "Qualify an explicit oral-history language label by permission reference without establishing consent validity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          interviewId: { type: "string", maxLength: 8192, minLength: 1 },
          languageWording: { type: "string", maxLength: 8192, minLength: 1 },
          permissionReference: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
        },
        required: ["interviewId", "languageWording", "permissionReference"],
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
            id: "interviewId",
            label: "Interview Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "languageWording",
            label: "Language Wording",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "permissionReference",
            label: "Permission Reference",
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
export const run = africanOralHistoryConsentedLanguageLabelTool.execute;
export default africanOralHistoryConsentedLanguageLabelTool;
