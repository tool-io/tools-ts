import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly usedLanguage: string;
  readonly authenticLanguages: readonly string[];
};
export type Output = { readonly listedAsAuthentic: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usedLanguage: { type: "string", maxLength: 8192, minLength: 1 },
    authenticLanguages: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["usedLanguage", "authenticLanguages"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { listedAsAuthentic: { type: "boolean" } },
  required: ["listedAsAuthentic"],
} as const;
/** Check literal language membership in a supplied authentic-language list without interpreting contractual precedence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { usedLanguage, authenticLanguages } = request;
  const compute = (): Output => {
    H.domain(usedLanguage.length > 0, "usedLanguage");
    return { listedAsAuthentic: authenticLanguages.includes(usedLanguage) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { usedLanguage: "en", authenticLanguages: ["en", "fr"] },
  output: { listedAsAuthentic: true },
} satisfies ToolExample<Input, Output>;
export const internationalContractAuthenticlanguageFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: [
          "international-business",
          "international business",
          "business and finance",
        ],
        keywords: ["international business", "business and finance"],
      },
      id: "international-business/international-contract-authentic-language-flag",
      title: "International Contract Authentic Language Flag",
      description:
        "Check literal language membership in a supplied authentic-language list without interpreting contractual precedence.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          usedLanguage: { type: "string", maxLength: 8192, minLength: 1 },
          authenticLanguages: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["usedLanguage", "authenticLanguages"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { listedAsAuthentic: { type: "boolean" } },
        required: ["listedAsAuthentic"],
      },
      ports: {
        inputs: [
          {
            id: "usedLanguage",
            label: "Used Language",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "authenticLanguages",
            label: "Authentic Languages",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "listedAsAuthentic",
            label: "Listed As Authentic",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = internationalContractAuthenticlanguageFlagTool.execute;
export default internationalContractAuthenticlanguageFlagTool;
