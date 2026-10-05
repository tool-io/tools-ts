import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly languageCode: string;
  readonly authenticLanguageCodes: readonly string[];
};
export type Output = { readonly authentic: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    languageCode: { type: "string", maxLength: 8192 },
    authenticLanguageCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["languageCode", "authenticLanguageCodes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { authentic: { type: "boolean" } },
  required: ["authentic"],
} as const;
/** Check a language code against an explicit list of authentic treaty languages without inferring authenticity from translation availability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { languageCode, authenticLanguageCodes } = request;
  const compute = (): Output => {
    H.domain(languageCode.length > 0, "languageCode");
    return { authentic: authenticLanguageCodes.includes(languageCode) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { languageCode: "fr", authenticLanguageCodes: ["en", "fr"] },
  output: { authentic: true },
} satisfies ToolExample<Input, Output>;
export const treatyLanguageAuthenticityFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-relations/treaty-language-authenticity-flag",
    title: "Treaty Language Authenticity Flag Tool",
    description:
      "Check a language code against an explicit list of authentic treaty languages without inferring authenticity from translation availability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        languageCode: { type: "string", maxLength: 8192 },
        authenticLanguageCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["languageCode", "authenticLanguageCodes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { authentic: { type: "boolean" } },
      required: ["authentic"],
    },
    ports: {
      inputs: [
        {
          id: "languageCode",
          label: "Language Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "authenticLanguageCodes",
          label: "Authentic Language Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "authentic", label: "Authentic", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = treatyLanguageAuthenticityFlagTool.execute;
export default treatyLanguageAuthenticityFlagTool;
