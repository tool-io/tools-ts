import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TiHiPatternStabilityCheckerInput = {
  readonly cartonLengthCm: number;
  readonly cartonWidthCm: number;
  readonly cartonHeightCm: number;
  readonly layerCount: number;
  readonly maximumStabilityAspectRatio?: number;
};

export type TiHiPatternStabilityCheckerOutput = {
  readonly stackHeightCm: number;
  readonly stabilityAspectRatio: number;
  readonly stabilityClassification: "stable" | "reviewRecommended";
};

export const calculateTiHiPatternStabilityChecker = (
  input: TiHiPatternStabilityCheckerInput,
): TiHiPatternStabilityCheckerOutput => {
  for (const key of [
    "cartonLengthCm",
    "cartonWidthCm",
    "cartonHeightCm",
  ] as const) {
    if (!Number.isFinite(input[key]) || input[key] <= 0)
      return simpleError(
        key,
        "Carton dimensions must be finite and greater than zero.",
        "invalid_dimension",
      );
  }
  if (!(Number.isSafeInteger(input.layerCount) && input.layerCount >= 1))
    return simpleError(
      "layerCount",
      "The layer count must be a whole number of at least one.",
      "invalid_layers",
    );
  const maximumStabilityAspectRatio = input.maximumStabilityAspectRatio ?? 2;
  if (
    !Number.isFinite(maximumStabilityAspectRatio) ||
    maximumStabilityAspectRatio <= 0
  )
    return simpleError(
      "maximumStabilityAspectRatio",
      "The aspect-ratio threshold must be finite and greater than zero.",
      "invalid_threshold",
    );
  const stackHeightCm = input.layerCount * input.cartonHeightCm;
  const stabilityAspectRatio =
    stackHeightCm / Math.min(input.cartonLengthCm, input.cartonWidthCm);
  if (
    !Number.isFinite(stackHeightCm) ||
    stackHeightCm <= 0 ||
    !Number.isFinite(stabilityAspectRatio) ||
    stabilityAspectRatio <= 0
  )
    return simpleError(
      "layerCount",
      "The stability ratio is outside the representable range.",
      "ratio_out_of_range",
    );
  return {
    stackHeightCm,
    stabilityAspectRatio,
    stabilityClassification:
      stabilityAspectRatio <= maximumStabilityAspectRatio
        ? "stable"
        : "reviewRecommended",
  };
};

export const tiHiPatternStabilityCheckerExample = {
  input: {
    cartonLengthCm: 40,
    cartonWidthCm: 30,
    cartonHeightCm: 25,
    layerCount: 2,
  },
  output: {
    stackHeightCm: 50,
    stabilityAspectRatio: 1.6666666666666667,
    stabilityClassification: "stable",
  },
} satisfies ToolExample<
  TiHiPatternStabilityCheckerInput,
  TiHiPatternStabilityCheckerOutput
>;

export const tiHiPatternStabilityCheckerTool = createSimpleTool({
  id: "logistics/ti-hi-pattern-stability-checker",
  title: "TI-HI Pattern Stability Checker",
  description:
    "Heuristic column-stack review: flag pallet patterns whose built height divided by the smallest carton footprint side exceeds an adjustable aspect-ratio threshold (default 2).",
  inputs: [
    {
      description: "Carton length in centimetres.",
      id: "cartonLengthCm",
      kind: "number",
      label: "Length",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
    {
      description: "Carton width in centimetres.",
      id: "cartonWidthCm",
      kind: "number",
      label: "Width",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
    {
      description: "Carton height in centimetres.",
      id: "cartonHeightCm",
      kind: "number",
      label: "Height",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
    {
      description: "Number of layers in the pattern (HI).",
      id: "layerCount",
      kind: "integer",
      label: "Layers",
      minimum: 1,
    },
    {
      default: 2,
      description:
        "Screening threshold for height divided by the smallest footprint side; it does not replace a load-stability assessment.",
      id: "maximumStabilityAspectRatio",
      kind: "number",
      label: "Max ratio",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      description: "Built stack height in centimetres.",
      id: "stackHeightCm",
      kind: "number",
      label: "Stack height",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
    {
      description: "Stack height divided by the smallest footprint side.",
      id: "stabilityAspectRatio",
      kind: "number",
      label: "Aspect ratio",
      minimum: Number.MIN_VALUE,
    },
    {
      description: "Stable, or a recommendation to review the pattern.",
      id: "stabilityClassification",
      enum: ["stable", "reviewRecommended"],
      kind: "string",
      label: "Classification",
    },
  ],
  calculate: (input) =>
    calculateTiHiPatternStabilityChecker({
      cartonHeightCm: input.cartonHeightCm as number,
      cartonLengthCm: input.cartonLengthCm as number,
      cartonWidthCm: input.cartonWidthCm as number,
      layerCount: input.layerCount as number,
      maximumStabilityAspectRatio: input.maximumStabilityAspectRatio as
        number | undefined,
    }),
});

export const runTiHiPatternStabilityChecker =
  tiHiPatternStabilityCheckerTool.execute;
export default tiHiPatternStabilityCheckerTool;
