import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CrosswindGustComponentInput = {
  readonly gustAngleDeg: number;
  readonly gustKt: number;
};

export type CrosswindGustComponentOutput = {
  readonly crosswindGustKt: number;
};

export const crosswindGustComponentExample = {
  input: { gustAngleDeg: 90, gustKt: 30 },
  output: { crosswindGustKt: 30 },
} satisfies ToolExample<
  CrosswindGustComponentInput,
  CrosswindGustComponentOutput
>;

export const calculateCrosswindGustComponent = (
  input: CrosswindGustComponentInput,
): CrosswindGustComponentOutput => ({
  crosswindGustKt: Math.abs(
    input.gustKt * Math.sin((input.gustAngleDeg * Math.PI) / 180),
  ),
});

export const crosswindGustComponentTool = createSimpleTool({
  calculate: (input) =>
    calculateCrosswindGustComponent(
      input as unknown as CrosswindGustComponentInput,
    ),
  description:
    "Compute the crosswind component of a peak gust at a given angle to the runway.",
  id: "aviation/crosswind-gust-component",
  inputs: [
    {
      description: "Angle between the gust and the runway centerline.",
      id: "gustAngleDeg",
      kind: "number",
      label: "Gust angle",
      unit: "°",
    },
    {
      description: "Peak gust speed.",
      id: "gustKt",
      kind: "number",
      label: "Gust",
      unit: "kt",
    },
  ],
  outputs: [
    {
      description: "Crosswind component of the peak gust.",
      format: "speed",
      id: "crosswindGustKt",
      kind: "number",
      label: "Crosswind gust",
      unit: "kt",
    },
  ],
  title: "Crosswind Gust Component Calculator",
});
export const runCrosswindGustComponent = crosswindGustComponentTool.execute;
export default crosswindGustComponentTool;
