import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SerifEraClassifierInput = {
  readonly averageSerifWidthMm: number;
  readonly averageStrokeWidthMm: number;
  readonly thresholdRatio?: number;
};

export type SerifEraClassifierOutput = {
  readonly serifToStrokeRatio: number;
  readonly era: "republican" | "imperial";
};

export const calculateSerifEraClassifier = (
  input: SerifEraClassifierInput,
): SerifEraClassifierOutput => {
  if (!(input.averageSerifWidthMm > 0))
    simpleError(
      "averageSerifWidthMm",
      "Serif width must be greater than zero.",
      "invalid_serif_width",
    );
  if (!(input.averageStrokeWidthMm > 0))
    simpleError(
      "averageStrokeWidthMm",
      "Stroke width must be greater than zero.",
      "invalid_stroke_width",
    );
  const thresholdRatio = input.thresholdRatio ?? 0.4;
  if (!(thresholdRatio > 0))
    simpleError(
      "thresholdRatio",
      "Threshold ratio must be greater than zero.",
      "invalid_threshold",
    );
  const serifToStrokeRatio =
    input.averageSerifWidthMm / input.averageStrokeWidthMm;
  return {
    serifToStrokeRatio,
    era: serifToStrokeRatio >= thresholdRatio ? "imperial" : "republican",
  };
};

export const serifEraClassifierExample = {
  input: { averageSerifWidthMm: 1.2, averageStrokeWidthMm: 4 },
  output: { serifToStrokeRatio: 0.3, era: "republican" },
} satisfies ToolExample<SerifEraClassifierInput, SerifEraClassifierOutput>;

export const serifEraClassifierTool = createSimpleTool({
  id: "epigraphy/serif-era-classifier",
  title: "Serif Style Era Classifier",
  description:
    "Heuristically classifies lapidary lettering as Republican (hairline serifs) or Imperial (robust slab serifs) from the serif-to-stroke width ratio against a configurable threshold.",
  inputs: [
    {
      id: "averageSerifWidthMm",
      kind: "number",
      label: "Serif width",
      description: "Mean serif width in millimetres.",
      minimum: 0,
    },
    {
      id: "averageStrokeWidthMm",
      kind: "number",
      label: "Stroke width",
      description: "Mean principal stroke width in millimetres.",
      minimum: 0,
    },
    {
      id: "thresholdRatio",
      kind: "number",
      label: "Threshold",
      description: "Ratio at or above which lettering counts as Imperial.",
      default: 0.4,
    },
  ],
  outputs: [
    {
      id: "serifToStrokeRatio",
      kind: "number",
      label: "Ratio",
      description: "Serif width divided by stroke width.",
    },
    {
      id: "era",
      kind: "string",
      enum: ["republican", "imperial"],
      label: "Era",
      description: "Assigned lapidary style period.",
    },
  ],
  calculate: (input) =>
    calculateSerifEraClassifier(input as unknown as SerifEraClassifierInput),
});

export const runSerifEraClassifier = serifEraClassifierTool.execute;
export default serifEraClassifierTool;
