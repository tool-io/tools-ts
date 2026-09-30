import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly suppliedEmphaticTokens: readonly string[];
};
export type Output = { readonly matches: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    suppliedEmphaticTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["token", "suppliedEmphaticTokens"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { matches: { type: "boolean" } },
  required: ["matches"],
} as const;
/** Match an explicitly supplied transliteration token inventory without inferring phonology or language. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, suppliedEmphaticTokens } = request;
  const compute = (): Output => {
    return { matches: suppliedEmphaticTokens.includes(token) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "ṣ", suppliedEmphaticTokens: ["ṣ", "ṭ"] },
  output: { matches: true },
} satisfies ToolExample<Input, Output>;
export const publicTransliterationEmphaticTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "middle-eastern-studies/public-transliteration-emphatic-token",
    title: "Public Transliteration Emphatic Token Tool",
    description:
      "Match an explicitly supplied transliteration token inventory without inferring phonology or language.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        suppliedEmphaticTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["token", "suppliedEmphaticTokens"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { matches: { type: "boolean" } },
      required: ["matches"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedEmphaticTokens",
          label: "Supplied Emphatic Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = publicTransliterationEmphaticTokenTool.execute;
export default publicTransliterationEmphaticTokenTool;
