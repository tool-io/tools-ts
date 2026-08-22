import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TailwindComponentInput = {
  readonly windAngleDeg: number;
  readonly windSpeedKt: number;
};

export type TailwindComponentOutput = {
  readonly tailwindKt: number;
};

const DEG_TO_RAD = Math.PI / 180;

export const tailwindComponentExample = {
  input: { windAngleDeg: 180, windSpeedKt: 20 },
  output: { tailwindKt: 20 },
} satisfies ToolExample<TailwindComponentInput, TailwindComponentOutput>;

export const calculateTailwindComponent = (
  input: TailwindComponentInput,
): TailwindComponentOutput => ({
  tailwindKt:
    Math.round(
      input.windSpeedKt * Math.cos(input.windAngleDeg * DEG_TO_RAD) * -1e9,
    ) / 1e9,
});

export const tailwindComponentTool = createSimpleTool({
  calculate: (input) =>
    calculateTailwindComponent(input as unknown as TailwindComponentInput),
  description:
    "Compute the signed tailwind component of a wind at an angle to the course; positive values are tailwinds.",
  id: "aviation/tailwind-component",
  inputs: [
    {
      description:
        "Angle between the wind direction and the course; zero degrees is a direct headwind.",
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
        "Tailwind component; positive means a tailwind, negative means a headwind.",
      format: "speed",
      id: "tailwindKt",
      kind: "number",
      label: "Tailwind component",
      unit: "kt",
    },
  ],
  title: "Tailwind Component Calculator",
});
export const runTailwindComponent = tailwindComponentTool.execute;
export default tailwindComponentTool;
