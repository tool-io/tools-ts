import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wordId: string;
  readonly confidenceText: string;
  readonly suppliedScale: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wordId: { type: "string", maxLength: 8192, minLength: 1 },
    confidenceText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedScale: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["wordId", "confidenceText", "suppliedScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit OCR word-confidence transcription and scale without interpreting or calibrating confidence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wordId, confidenceText, suppliedScale } = request;
  const compute = (): Output => {
    H.domain(wordId.length > 0, "wordId");
    H.domain(confidenceText.length > 0, "confidenceText");
    H.domain(suppliedScale.length > 0, "suppliedScale");
    return { token: JSON.stringify([wordId, confidenceText, suppliedScale]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wordId: "W17", confidenceText: "0.93", suppliedScale: "fraction" },
  output: { token: '["W17","0.93","fraction"]' },
} satisfies ToolExample<Input, Output>;
export const ocrWordConfidenceScalePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "digital-humanities/ocr-word-confidence-scale-pair",
    title: "Ocr Word Confidence Scale Pair Tool",
    description:
      "Preserve an explicit OCR word-confidence transcription and scale without interpreting or calibrating confidence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wordId: { type: "string", maxLength: 8192, minLength: 1 },
        confidenceText: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedScale: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["wordId", "confidenceText", "suppliedScale"],
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
          id: "wordId",
          label: "Word Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "confidenceText",
          label: "Confidence Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedScale",
          label: "Supplied Scale",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = ocrWordConfidenceScalePairTool.execute;
export default ocrWordConfidenceScalePairTool;
