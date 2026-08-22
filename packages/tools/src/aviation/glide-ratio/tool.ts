import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type GlideRatioInput = {
  readonly altitudeLostFt: number;
  readonly horizontalDistanceFt: number;
};

export type GlideRatioOutput = {
  readonly glideRatio: number;
};

export const glideRatioExample = {
  input: { altitudeLostFt: 1000, horizontalDistanceFt: 9000 },
  output: { glideRatio: 9 },
} satisfies ToolExample<GlideRatioInput, GlideRatioOutput>;

export const calculateGlideRatio = (
  input: GlideRatioInput,
): GlideRatioOutput => {
  if (input.altitudeLostFt <= 0)
    simpleError(
      "altitudeLostFt",
      "The altitude lost must be positive.",
      "invalid_altitude",
    );
  return {
    glideRatio: roundStatistic(
      input.horizontalDistanceFt / input.altitudeLostFt,
    ),
  };
};

export const glideRatioTool = createSimpleTool({
  calculate: (input) =>
    calculateGlideRatio(input as unknown as GlideRatioInput),
  description:
    "Compute the glide ratio as horizontal distance covered per unit of altitude lost.",
  id: "aviation/glide-ratio",
  inputs: [
    {
      description: "Horizontal distance covered during the descent.",
      id: "horizontalDistanceFt",
      kind: "number",
      label: "Horizontal distance",
      unit: "ft",
    },
    {
      description: "Altitude lost during the descent.",
      id: "altitudeLostFt",
      kind: "number",
      label: "Altitude lost",
      unit: "ft",
    },
  ],
  outputs: [
    {
      description:
        "Distance travelled forward per unit of altitude, for example nine for a 9:1 glider.",
      format: "ratio",
      id: "glideRatio",
      kind: "number",
      label: "Glide ratio",
    },
  ],
  title: "Glide Ratio Calculator",
});
export const runGlideRatio = glideRatioTool.execute;
export default glideRatioTool;
