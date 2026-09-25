import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly confidence: number;
  readonly threshold: number;
  readonly inclusive: boolean;
};
export type Output = { readonly margin: number; readonly accepted: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    confidence: { type: "number", minimum: 0, maximum: 1 },
    threshold: { type: "number", minimum: 0, maximum: 1 },
    inclusive: { type: "boolean" },
  },
  required: ["confidence", "threshold", "inclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { margin: { type: "number" }, accepted: { type: "boolean" } },
  required: ["margin", "accepted"],
} as const;
/** Calculate ocr word confidence threshold margin from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { confidence, threshold, inclusive } = request;
  const compute = (): Output => {
    H.probability(confidence);
    H.probability(threshold);
    return {
      margin: confidence - threshold,
      accepted: inclusive ? confidence >= threshold : confidence > threshold,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { confidence: 0.8, threshold: 0.7, inclusive: true },
  output: { margin: 0.10000000000000009, accepted: true },
} satisfies ToolExample<Input, Output>;
export const ocrWordConfidenceThresholdMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "digital-humanities/ocr-word-confidence-threshold-margin",
    title: "OCR Word Confidence Threshold Margin Tool",
    description:
      "Calculate ocr word confidence threshold margin from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        confidence: { type: "number", minimum: 0, maximum: 1 },
        threshold: { type: "number", minimum: 0, maximum: 1 },
        inclusive: { type: "boolean" },
      },
      required: ["confidence", "threshold", "inclusive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { margin: { type: "number" }, accepted: { type: "boolean" } },
      required: ["margin", "accepted"],
    },
    ports: {
      inputs: [
        {
          id: "confidence",
          label: "Confidence",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "threshold",
          label: "Threshold",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inclusive",
          label: "Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "margin", label: "Margin", valueType: { type: "number" } },
        { id: "accepted", label: "Accepted", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = ocrWordConfidenceThresholdMarginTool.execute;
export default ocrWordConfidenceThresholdMarginTool;
