import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly headword: string;
  readonly alternativeIndex: number;
};
export type Output = { readonly entryKey: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    headword: { type: "string", maxLength: 8192, minLength: 1 },
    alternativeIndex: { type: "integer", minimum: 1 },
  },
  required: ["headword", "alternativeIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { entryKey: { type: "string", maxLength: 8192 } },
  required: ["entryKey"],
} as const;
/** Append an explicit parenthesized positive pronunciation alternative index to a supplied headword without looking up pronunciation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { headword, alternativeIndex } = request;
  const compute = (): Output => {
    H.domain(headword.length > 0, "headword");
    (H.domain(
      Number.isSafeInteger(alternativeIndex) &&
        alternativeIndex >= 1 &&
        alternativeIndex <= Number.MAX_SAFE_INTEGER,
      "alternativeIndex",
    ),
      alternativeIndex);
    return { entryKey: headword + "(" + alternativeIndex + ")" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { headword: "read", alternativeIndex: 2 },
  output: { entryKey: "read(2)" },
} satisfies ToolExample<Input, Output>;
export const pronunciationLexiconAlternativeIndexTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: [
          "computational-linguistics",
          "computational linguistics",
          "information and language sciences",
        ],
        keywords: [
          "computational linguistics",
          "information and language sciences",
        ],
      },
      id: "computational-linguistics/pronunciation-lexicon-alternative-index",
      title: "Pronunciation Lexicon Alternative Index",
      description:
        "Append an explicit parenthesized positive pronunciation alternative index to a supplied headword without looking up pronunciation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          headword: { type: "string", maxLength: 8192, minLength: 1 },
          alternativeIndex: { type: "integer", minimum: 1 },
        },
        required: ["headword", "alternativeIndex"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { entryKey: { type: "string", maxLength: 8192 } },
        required: ["entryKey"],
      },
      ports: {
        inputs: [
          {
            id: "headword",
            label: "Headword",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "alternativeIndex",
            label: "Alternative Index",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "entryKey", label: "Entry Key", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = pronunciationLexiconAlternativeIndexTool.execute;
export default pronunciationLexiconAlternativeIndexTool;
