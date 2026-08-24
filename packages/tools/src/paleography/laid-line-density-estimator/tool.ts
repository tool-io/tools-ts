import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LaidLineDensityEstimatorInput = {
  readonly laidLinesCounted: number;
  readonly measuredSpanMm: number;
};

export type LaidLineDensityEstimatorOutput = {
  readonly laidLinesPerCentimetre: number;
};

export const calculateLaidLineDensityEstimator = (
  input: LaidLineDensityEstimatorInput,
): LaidLineDensityEstimatorOutput => {
  if (!(
    Number.isSafeInteger(input.laidLinesCounted) && input.laidLinesCounted >= 0
  ))
    return simpleError(
      "laidLinesCounted",
      "The counted lines must be a non-negative integer.",
      "invalid_count",
    );
  if (!(Number.isFinite(input.measuredSpanMm) && input.measuredSpanMm > 0))
    return simpleError(
      "measuredSpanMm",
      "The measured span must be greater than zero.",
      "invalid_span",
    );
  const laidLinesPerCentimetre =
    (input.laidLinesCounted / input.measuredSpanMm) * 10;
  if (!Number.isFinite(laidLinesPerCentimetre))
    return simpleError(
      "measuredSpanMm",
      "The span is too small to produce a representable density.",
      "invalid_span",
    );
  return { laidLinesPerCentimetre };
};

export const laidLineDensityEstimatorExample = {
  input: { laidLinesCounted: 60, measuredSpanMm: 45 },
  output: { laidLinesPerCentimetre: 13.333333333333332 },
} satisfies ToolExample<
  LaidLineDensityEstimatorInput,
  LaidLineDensityEstimatorOutput
>;

export const laidLineDensityEstimatorTool = createSimpleTool({
  id: "paleography/laid-line-density-estimator",
  title: "Laid Line Density Estimator",
  description:
    "Estimate laid-line density exactly by dividing the counted lines over a measured span by that span in centimetres.",
  inputs: [
    {
      description: "Laid lines counted across the span.",
      id: "laidLinesCounted",
      kind: "integer",
      label: "Counted lines",
      minimum: 0,
    },
    {
      description:
        "Positive span across which they were counted, in millimetres.",
      id: "measuredSpanMm",
      kind: "number",
      label: "Span (mm)",
    },
  ],
  outputs: [
    {
      description: "Laid lines per centimetre.",
      id: "laidLinesPerCentimetre",
      kind: "number",
      label: "Lines per cm",
    },
  ],
  calculate: (input) =>
    calculateLaidLineDensityEstimator({
      laidLinesCounted: input.laidLinesCounted as number,
      measuredSpanMm: input.measuredSpanMm as number,
    }),
});

export const runLaidLineDensityEstimator = laidLineDensityEstimatorTool.execute;
export default laidLineDensityEstimatorTool;
