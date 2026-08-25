import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ComfortRatioInput = {
  readonly displacementPounds: number;
  readonly lengthOverallFeet?: number;
  readonly waterlineLengthFeet: number;
};

export type ComfortRatioOutput = {
  readonly comfortRatio: number;
};

const COMFORT_RATIO_COEFFICIENT = 0.65;

export const comfortRatioExample = {
  input: { displacementPounds: 16250, waterlineLengthFeet: 50 },
  output: { comfortRatio: 135.72088082974537 },
} satisfies ToolExample<ComfortRatioInput, ComfortRatioOutput>;

export const calculateComfortRatio = (
  input: ComfortRatioInput,
): ComfortRatioOutput => {
  const lengthOverallFeet =
    (input.lengthOverallFeet ?? 0) > 0
      ? input.lengthOverallFeet!
      : input.waterlineLengthFeet;
  if (
    input.displacementPounds <= 0 ||
    input.waterlineLengthFeet <= 0 ||
    lengthOverallFeet <= 0
  )
    simpleError(
      "displacementPounds",
      "Displacement and waterline length must be positive.",
      "invalid_input",
    );
  return {
    comfortRatio:
      input.displacementPounds /
      (COMFORT_RATIO_COEFFICIENT *
        Math.pow(
          0.7 * input.waterlineLengthFeet + 0.3 * lengthOverallFeet,
          4 / 3,
        )),
  };
};

export const comfortRatioTool = createSimpleTool({
  calculate: (input) =>
    calculateComfortRatio(input as unknown as ComfortRatioInput),
  description:
    "Compute Ted Brewer's motion-comfort ratio from displacement, waterline length, and length overall. When LOA is omitted, it is assumed equal to LWL.",
  id: "sailing/comfort-ratio",
  inputs: [
    {
      description: "Displacement of the vessel.",
      format: "weight-lb",
      id: "displacementPounds",
      kind: "number",
      label: "Displacement",
      unit: "lb",
    },
    {
      default: 0,
      description:
        "Length overall; leave at zero to assume it equals waterline length.",
      id: "lengthOverallFeet",
      kind: "number",
      label: "Length overall",
      minimum: 0,
      unit: "ft",
    },
    {
      description: "Waterline length.",
      format: "length-ft",
      id: "waterlineLengthFeet",
      kind: "number",
      label: "Waterline length",
      unit: "ft",
    },
  ],
  outputs: [
    {
      description:
        "Comfort ratio; larger values indicate a steadier, heavier motion.",
      format: "ratio",
      id: "comfortRatio",
      kind: "number",
      label: "Comfort ratio",
    },
  ],
  title: "Comfort Ratio Calculator",
});
export const runComfortRatio = comfortRatioTool.execute;
export default comfortRatioTool;
