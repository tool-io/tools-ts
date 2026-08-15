import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";
import { computeWindComponents } from "../wind-correction-angle/tool.js";

export type HeadwindComponentInput = {
  readonly windAngleDeg: number;
  readonly windSpeedKt: number;
};

export type HeadwindComponentOutput = {
  readonly headwindKt: number;
};

export const headwindComponentExample = {
  input: { windAngleDeg: 0, windSpeedKt: 30 },
  output: { headwindKt: 30 },
} satisfies ToolExample<HeadwindComponentInput, HeadwindComponentOutput>;

export const calculateHeadwindComponent = (
  input: HeadwindComponentInput,
): HeadwindComponentOutput => {
  const rounded = roundStatistic(
    computeWindComponents(
      input.windSpeedKt as number,
      input.windAngleDeg as number,
    ).headwind,
  );
  return { headwindKt: rounded < 1e-12 && rounded > -1e-12 ? 0 : rounded };
};

export const headwindComponentTool = createSimpleTool({
  calculate: (input) =>
    calculateHeadwindComponent(
      input as unknown as HeadwindComponentInput,
    ),
  description:
    "Compute the signed headwind component of a wind; negative values are tailwinds.",
  id: "aviation/headwind-component",
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
        "Headwind component; negative means a tailwind of that size.",
      format: "speed",
      id: "headwindKt",
      kind: "number",
      label: "Headwind",
      unit: "kt",
    },
  ],
  title: "Headwind Component Calculator",
});
export const runHeadwindComponent = headwindComponentTool.execute;
export default headwindComponentTool;
