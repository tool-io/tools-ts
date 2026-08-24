import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OcrConfidenceThresholdCounterInput = {
  readonly confidences: readonly number[];
  readonly threshold?: number;
};

export type OcrConfidenceThresholdCounterOutput = {
  readonly totalCount: number;
  readonly belowCount: number;
  readonly fractionBelow: number;
};

export const calculateOcrConfidenceThresholdCounter = (
  input: OcrConfidenceThresholdCounterInput,
): OcrConfidenceThresholdCounterOutput => {
  const confidences = input.confidences;
  if (!Array.isArray(confidences) || confidences.length === 0)
    simpleError(
      "confidences",
      "At least one confidence score is required.",
      "invalid_confidences",
    );
  for (let i = 0; i < confidences.length; i += 1) {
    const v = (confidences as readonly number[])[i] as number;
    if (!Number.isFinite(v) || v < 0 || v > 1)
      simpleError(
        "confidences",
        "Confidence scores must be finite numbers between 0 and 1.",
        "invalid_confidences",
      );
  }
  const threshold = input.threshold ?? 0.8;
  if (!Number.isFinite(threshold) || threshold < 0 || threshold > 1)
    simpleError(
      "threshold",
      "Threshold must be a finite number between 0 and 1.",
      "invalid_threshold",
    );
  const belowCount = confidences.filter((value) => value < threshold).length;
  return {
    totalCount: confidences.length,
    belowCount,
    fractionBelow: belowCount / confidences.length,
  };
};

export const ocrConfidenceThresholdCounterExample = {
  input: { confidences: [0.99, 0.42, 0.87, 0.55], threshold: 0.8 },
  output: { totalCount: 4, belowCount: 2, fractionBelow: 0.5 },
} satisfies ToolExample<
  OcrConfidenceThresholdCounterInput,
  OcrConfidenceThresholdCounterOutput
>;

export const ocrConfidenceThresholdCounterTool = createSimpleTool({
  id: "archival-studies/ocr-confidence-threshold-counter",
  title: "OCR Confidence Score Below Threshold Word Counter",
  description:
    "Count OCR word confidence scores that fall below a review threshold and report the affected fraction of the transcribed words.",
  inputs: [
    {
      description: "Per-word OCR confidence scores between 0 and 1.",
      id: "confidences",
      kind: "numberList",
      label: "Confidences",
    },
    {
      default: 0.8,
      description: "Review threshold; words scoring under it are counted.",
      id: "threshold",
      kind: "number",
      label: "Threshold",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Total number of confidence scores supplied.",
      id: "totalCount",
      kind: "integer",
      label: "Total words",
    },
    {
      description: "Number of scores strictly below the threshold.",
      id: "belowCount",
      kind: "integer",
      label: "Below threshold",
    },
    {
      description: "Below-threshold share of all scores, 0-1.",
      id: "fractionBelow",
      kind: "number",
      label: "Fraction below",
    },
  ],
  calculate: (input) =>
    calculateOcrConfidenceThresholdCounter({
      confidences: input.confidences as readonly number[],
      threshold: (input.threshold as number | undefined) ?? undefined,
    }),
});

export const runOcrConfidenceThresholdCounter =
  ocrConfidenceThresholdCounterTool.execute;
export default ocrConfidenceThresholdCounterTool;
