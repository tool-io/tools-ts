import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReliefDepthBandClassifierInput = {
  readonly depthMm: number;
  readonly shallowToMediumMm?: number;
  readonly mediumToDeepMm?: number;
};

export type ReliefDepthBandClassifierOutput = {
  readonly band: "shallow" | "medium" | "deep";
};

export const calculateReliefDepthBandClassifier = (
  input: ReliefDepthBandClassifierInput,
): ReliefDepthBandClassifierOutput => {
  if (!(input.depthMm >= 0))
    return simpleError(
      "depthMm",
      "Relief depth must be non-negative.",
      "invalid_depth",
    );
  const shallowToMedium = input.shallowToMediumMm ?? 2;
  const mediumToDeep = input.mediumToDeepMm ?? 10;
  if (!(shallowToMedium >= 0))
    return simpleError(
      "shallowToMediumMm",
      "The shallow-to-medium threshold must be non-negative.",
      "invalid_threshold",
    );
  if (!(mediumToDeep > shallowToMedium))
    return simpleError(
      "mediumToDeepMm",
      "The medium-to-deep threshold must exceed the shallow-to-medium threshold.",
      "invalid_threshold",
    );
  return {
    band:
      input.depthMm < shallowToMedium
        ? "shallow"
        : input.depthMm < mediumToDeep
          ? "medium"
          : "deep",
  };
};

export const reliefDepthBandClassifierExample = {
  input: { depthMm: 4 },
  output: { band: "medium" },
} satisfies ToolExample<
  ReliefDepthBandClassifierInput,
  ReliefDepthBandClassifierOutput
>;

export const reliefDepthBandClassifierTool = createSimpleTool({
  id: "epigraphy/relief-depth-band-classifier",
  title: "Relief Depth mm Shallow-Medium-Deep Band Classifier",
  description:
    "Assign a measured relief depth in millimetres to a shallow, medium, or deep band using configurable thresholds with defaults at 2 mm and 10 mm.",
  inputs: [
    {
      description: "Measured carving depth in millimetres.",
      id: "depthMm",
      kind: "number",
      label: "Depth",
      minimum: 0,
      unit: "mm",
    },
    {
      default: 2,
      description: "Upper bound of the shallow band in millimetres.",
      id: "shallowToMediumMm",
      kind: "number",
      label: "Shallow below",
      minimum: 0,
    },
    {
      default: 10,
      description: "Lower bound of the deep band in millimetres.",
      id: "mediumToDeepMm",
      kind: "number",
      label: "Deep from",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Band the depth falls into.",
      id: "band",
      enum: ["shallow", "medium", "deep"],
      kind: "string",
      label: "Band",
    },
  ],
  calculate: (input) =>
    calculateReliefDepthBandClassifier(
      input as unknown as ReliefDepthBandClassifierInput,
    ),
});

export const runReliefDepthBandClassifier =
  reliefDepthBandClassifierTool.execute;
export default reliefDepthBandClassifierTool;
