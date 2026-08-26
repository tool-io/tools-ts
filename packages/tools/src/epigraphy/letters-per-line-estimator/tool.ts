import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LettersPerLineEstimatorInput = {
  readonly stoneWidthMm: number;
  readonly averageLetterAdvanceMm: number;
  readonly letterSpacingMm?: number;
};

export type LettersPerLineEstimatorOutput = {
  readonly estimatedLettersPerLine: number;
  readonly effectivePitchMm: number;
};

export const calculateLettersPerLineEstimator = (
  input: LettersPerLineEstimatorInput,
): LettersPerLineEstimatorOutput => {
  if (!(input.stoneWidthMm > 0))
    simpleError(
      "stoneWidthMm",
      "Stone width must be greater than zero.",
      "invalid_width",
    );
  if (!(input.averageLetterAdvanceMm > 0))
    simpleError(
      "averageLetterAdvanceMm",
      "Letter advance must be greater than zero.",
      "invalid_advance",
    );
  const letterSpacingMm = input.letterSpacingMm ?? 0;
  if (!(letterSpacingMm >= 0))
    simpleError(
      "letterSpacingMm",
      "Letter spacing must be non-negative.",
      "invalid_spacing",
    );
  const effectivePitchMm = input.averageLetterAdvanceMm + letterSpacingMm;
  return {
    estimatedLettersPerLine: Math.floor(input.stoneWidthMm / effectivePitchMm),
    effectivePitchMm,
  };
};

export const lettersPerLineEstimatorExample = {
  input: { stoneWidthMm: 600, averageLetterAdvanceMm: 12 },
  output: { estimatedLettersPerLine: 50, effectivePitchMm: 12 },
} satisfies ToolExample<
  LettersPerLineEstimatorInput,
  LettersPerLineEstimatorOutput
>;

export const lettersPerLineEstimatorTool = createSimpleTool({
  id: "epigraphy/letters-per-line-estimator",
  title: "Letter Count Per Line Capacity Estimator",
  description:
    "Estimates how many letters fit per line by dividing the usable stone width by the letter advance plus optional inter-letter spacing.",
  inputs: [
    {
      id: "stoneWidthMm",
      kind: "number",
      label: "Stone width",
      description: "Usable inscribed width in millimetres.",
      minimum: 0,
    },
    {
      id: "averageLetterAdvanceMm",
      kind: "number",
      label: "Letter advance",
      description:
        "Average horizontal space one letter occupies in millimetres.",
      minimum: 0,
    },
    {
      id: "letterSpacingMm",
      kind: "number",
      label: "Letter spacing",
      description: "Extra inter-letter spacing in millimetres.",
      minimum: 0,
      default: 0,
    },
  ],
  outputs: [
    {
      id: "estimatedLettersPerLine",
      kind: "integer",
      label: "Letters per line",
      description: "Floored capacity estimate.",
    },
    {
      id: "effectivePitchMm",
      kind: "number",
      label: "Effective pitch",
      description: "Letter advance plus spacing in millimetres.",
    },
  ],
  calculate: (input) =>
    calculateLettersPerLineEstimator(
      input as unknown as LettersPerLineEstimatorInput,
    ),
});

export const runLettersPerLineEstimator = lettersPerLineEstimatorTool.execute;
export default lettersPerLineEstimatorTool;
