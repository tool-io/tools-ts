import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HeadwindCrosswindDecompositionInput = {
  readonly relativeAngleDeg: number;
  readonly windSpeedKt: number;
};

export type HeadwindCrosswindDecompositionOutput = {
  readonly crosswindComponentKt: number;
  readonly headwindComponentKt: number;
};

export const headwindCrosswindDecompositionExample = {
  input: { relativeAngleDeg: 0, windSpeedKt: 50 },
  output: { crosswindComponentKt: 0, headwindComponentKt: 50 },
} satisfies ToolExample<
  HeadwindCrosswindDecompositionInput,
  HeadwindCrosswindDecompositionOutput
>;

export const calculateHeadwindCrosswindDecomposition = (
  input: HeadwindCrosswindDecompositionInput,
): HeadwindCrosswindDecompositionOutput => {
  if (input.relativeAngleDeg < 0 || input.relativeAngleDeg > 360)
    simpleError(
      "relativeAngleDeg",
      "Relative angle must be between 0 and 360 degrees.",
      "out_of_range",
    );
  const thetaRad = (input.relativeAngleDeg * Math.PI) / 180;
  return {
    crosswindComponentKt: input.windSpeedKt * Math.sin(thetaRad),
    headwindComponentKt: input.windSpeedKt * Math.cos(thetaRad),
  };
};

export const headwindCrosswindDecompositionTool = createSimpleTool({
  calculate: (input) =>
    calculateHeadwindCrosswindDecomposition(
      input as unknown as HeadwindCrosswindDecompositionInput,
    ),
  description:
    "Decompose a wind relative to the course into headwind and crosswind components using headwindComponentKt = windSpeedKt * cos(angle) and crosswindComponentKt = windSpeedKt * sin(angle).",
  id: "aviation/headwind-crosswind-decomposition",
  inputs: [
    {
      description:
        "Angle between the wind direction and the course; zero is a direct headwind.",
      id: "relativeAngleDeg",
      kind: "number",
      label: "Relative angle",
      maximum: 360,
      minimum: 0,
      unit: "°",
    },
    {
      description: "Wind speed.",
      id: "windSpeedKt",
      kind: "number",
      label: "Wind speed",
      minimum: 0,
      unit: "kt",
    },
  ],
  outputs: [
    {
      description:
        "Headwind component; negative values indicate a tailwind component.",
      id: "headwindComponentKt",
      kind: "number",
      label: "Headwind component",
      unit: "kt",
    },
    {
      description:
        "Crosswind component; sign indicates the side it comes from.",
      id: "crosswindComponentKt",
      kind: "number",
      label: "Crosswind component",
      unit: "kt",
    },
  ],
  title: "Wind Decomposition Calculator",
});
export const runHeadwindCrosswindDecomposition =
  headwindCrosswindDecompositionTool.execute;
export default headwindCrosswindDecompositionTool;
