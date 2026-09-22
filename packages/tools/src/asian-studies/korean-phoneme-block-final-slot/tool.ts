import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly syllable: string };
export type Output = {
  readonly trailingIndex: number;
  readonly hasTrailingConsonant: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { syllable: { type: "string", maxLength: 8192 } },
  required: ["syllable"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trailingIndex: { type: "integer" },
    hasTrailingConsonant: { type: "boolean" },
  },
  required: ["trailingIndex", "hasTrailingConsonant"],
} as const;
/** Extract the Unicode modern Hangul syllable trailing-jamo slot, not a pronunciation or phonetic transcription. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { syllable } = request;
  const compute = (): Output => {
    const cp = syllable.codePointAt(0);
    H.domain(
      [...syllable].length === 1 &&
        cp !== undefined &&
        cp >= 44032 &&
        cp <= 55203,
      "syllable",
    );
    const trailingIndex = (cp - 44032) % 28;
    return { trailingIndex, hasTrailingConsonant: trailingIndex !== 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { syllable: "각" },
  output: { trailingIndex: 1, hasTrailingConsonant: true },
} satisfies ToolExample<Input, Output>;
export const koreanPhonemeBlockFinalSlotTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "asian-studies/korean-phoneme-block-final-slot",
    title: "Korean Phoneme Block Final Slot Tool",
    description:
      "Extract the Unicode modern Hangul syllable trailing-jamo slot, not a pronunciation or phonetic transcription.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { syllable: { type: "string", maxLength: 8192 } },
      required: ["syllable"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trailingIndex: { type: "integer" },
        hasTrailingConsonant: { type: "boolean" },
      },
      required: ["trailingIndex", "hasTrailingConsonant"],
    },
    ports: {
      inputs: [
        {
          id: "syllable",
          label: "Syllable",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "trailingIndex",
          label: "Trailing Index",
          valueType: { type: "integer" },
        },
        {
          id: "hasTrailingConsonant",
          label: "Has Trailing Consonant",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = koreanPhonemeBlockFinalSlotTool.execute;
export default koreanPhonemeBlockFinalSlotTool;
