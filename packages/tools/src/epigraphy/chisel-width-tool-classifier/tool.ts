import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ChiselWidthToolClassifierInput = {
  readonly strokeWidthMm: number;
  readonly fineToMediumMm?: number;
  readonly mediumToBroadMm?: number;
};

export type ChiselWidthToolClassifierOutput = {
  readonly toolClass: "fine" | "medium" | "broad";
};

export const calculateChiselWidthToolClassifier = (
  input: ChiselWidthToolClassifierInput,
): ChiselWidthToolClassifierOutput => {
  if (!(input.strokeWidthMm >= 0))
    return simpleError(
      "strokeWidthMm",
      "Stroke width must be non-negative.",
      "invalid_width",
    );
  const fineToMedium = input.fineToMediumMm ?? 5;
  const mediumToBroad = input.mediumToBroadMm ?? 15;
  if (!(fineToMedium >= 0))
    return simpleError(
      "fineToMediumMm",
      "The fine-to-medium threshold must be non-negative.",
      "invalid_threshold",
    );
  if (!(mediumToBroad > fineToMedium))
    return simpleError(
      "mediumToBroadMm",
      "The medium-to-broad threshold must exceed the fine-to-medium threshold.",
      "invalid_threshold",
    );
  return {
    toolClass:
      input.strokeWidthMm < fineToMedium
        ? "fine"
        : input.strokeWidthMm < mediumToBroad
          ? "medium"
          : "broad",
  };
};

export const chiselWidthToolClassifierExample = {
  input: { strokeWidthMm: 7 },
  output: { toolClass: "medium" },
} satisfies ToolExample<
  ChiselWidthToolClassifierInput,
  ChiselWidthToolClassifierOutput
>;

export const chiselWidthToolClassifierTool = createSimpleTool({
  id: "epigraphy/chisel-width-tool-classifier",
  title: "Chisel Stroke Width Tool Size Class Estimator",
  description:
    "Estimate the chisel size class behind a letter stroke from its width in millimetres using configurable thresholds with defaults at 5 mm and 15 mm.",
  inputs: [
    {
      description: "Measured stroke width in millimetres.",
      id: "strokeWidthMm",
      kind: "number",
      label: "Stroke width",
      minimum: 0,
      unit: "mm",
    },
    {
      default: 5,
      description: "Upper bound of the fine class in millimetres.",
      id: "fineToMediumMm",
      kind: "number",
      label: "Fine below",
      minimum: 0,
    },
    {
      default: 15,
      description: "Lower bound of the broad class in millimetres.",
      id: "mediumToBroadMm",
      kind: "number",
      label: "Broad from",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Estimated chisel size class.",
      id: "toolClass",
      enum: ["fine", "medium", "broad"],
      kind: "string",
      label: "Tool class",
    },
  ],
  calculate: (input) =>
    calculateChiselWidthToolClassifier(
      input as unknown as ChiselWidthToolClassifierInput,
    ),
});

export const runChiselWidthToolClassifier =
  chiselWidthToolClassifierTool.execute;
export default chiselWidthToolClassifierTool;
