import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly romanizedText: string };
export type Output = { readonly searchVariant: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { romanizedText: { type: "string", maxLength: 8192 } },
  required: ["romanizedText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { searchVariant: { type: "string", maxLength: 8192 } },
  required: ["searchVariant"],
} as const;
/** Create a macron-free search variant by removing only Latin vowel macrons; this does not convert between romanization systems. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { romanizedText } = request;
  const compute = (): Output => {
    return {
      searchVariant: romanizedText
        .replace(
          /[āīūēōĀĪŪĒŌ]/g,
          (c) =>
            ({
              ā: "a",
              ī: "i",
              ū: "u",
              ē: "e",
              ō: "o",
              Ā: "A",
              Ī: "I",
              Ū: "U",
              Ē: "E",
              Ō: "O",
            })[c] ?? c,
        )
        .replace(/([AEIOUaeiou])\u0304/g, "$1"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { romanizedText: "Tōkyō" },
  output: { searchVariant: "Tokyo" },
} satisfies ToolExample<Input, Output>;
export const japaneseMacronRomanizationSearchVariantTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "asian-studies/japanese-macron-romanization-search-variant",
      title: "Japanese Macron Romanization Search Variant Tool",
      description:
        "Create a macron-free search variant by removing only Latin vowel macrons; this does not convert between romanization systems.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { romanizedText: { type: "string", maxLength: 8192 } },
        required: ["romanizedText"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { searchVariant: { type: "string", maxLength: 8192 } },
        required: ["searchVariant"],
      },
      ports: {
        inputs: [
          {
            id: "romanizedText",
            label: "Romanized Text",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "searchVariant",
            label: "Search Variant",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = japaneseMacronRomanizationSearchVariantTool.execute;
export default japaneseMacronRomanizationSearchVariantTool;
