import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";
import { computeWindComponents } from "../wind-correction-angle/tool.js";

export type CrosswindComponentInput = {
  readonly windAngleDeg: number;
  readonly windSpeedKt: number;
};

export type CrosswindComponentOutput = {
  readonly crosswindKt: number;
};

export const crosswindComponentExample = {
  input: { windAngleDeg: 90, windSpeedKt: 30 },
  output: { crosswindKt: 30 },
} satisfies ToolExample<CrosswindComponentInput, CrosswindComponentOutput>;

export const calculateCrosswindComponent = (
  input: CrosswindComponentInput,
): CrosswindComponentOutput => {
  const rounded = roundStatistic(
    Math.abs(
      computeWindComponents(
        input.windSpeedKt as number,
        input.windAngleDeg as number,
      ).crosswind,
    ),
  );
  return { crosswindKt: rounded < 1e-12 ? 0 : rounded };
};

export const crosswindComponentTool = createSimpleTool({
  calculate: (input) =>
    calculateCrosswindComponent(
      input as unknown as CrosswindComponentInput,
    ),
  description:
    "Compute the magnitude of the crosswind component of a wind at an angle to the runway or course.",
  id: "aviation/crosswind-component",
  inputs: [
    {
      description:
        "Angle between wind and course or runway; zero is a direct headwind.",
      id: "windAngleDeg",
      kind: "number",
      label: "Wind angle",
      unit: "°",
    },
    {
      description: "Wind speed.",
      id: "windSpeedKt",
      kind: "number",
      label: "Wind speed",
      unit: "kt",
    },
  ],
  outputs: [
    {
      description:
        "Crosswind magnitude, independent of which side it comes from.",
      format: "speed",
      id: "crosswindKt",
      kind: "number",
      label: "Crosswind",
      unit: "kt",
    },
  ],
  title: "Crosswind Component Calculator",
});
export const runCrosswindComponent = crosswindComponentTool.execute;
export default crosswindComponentTool;
