import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WindSpeedFromComponentsInput = {
  readonly headwindComponent: number;
  readonly crosswindComponent: number;
};

export type WindSpeedFromComponentsOutput = {
  readonly windSpeedKt: number;
};

export const windSpeedFromComponentsExample = {
  input: { headwindComponent: 30, crosswindComponent: 40 },
  output: { windSpeedKt: 50 },
} satisfies ToolExample<
  WindSpeedFromComponentsInput,
  WindSpeedFromComponentsOutput
>;

export const calculateWindSpeedFromComponents = (
  input: WindSpeedFromComponentsInput,
): WindSpeedFromComponentsOutput => {
  if (input.headwindComponent === 0 && input.crosswindComponent === 0)
    simpleError(
      "headwindComponent",
      "Both components are zero, so the wind speed is undefined.",
      "zero_wind",
    );
  return {
    windSpeedKt: Math.hypot(input.headwindComponent, input.crosswindComponent),
  };
};

export const windSpeedFromComponentsTool = createSimpleTool({
  calculate: (input) =>
    calculateWindSpeedFromComponents(
      input as unknown as WindSpeedFromComponentsInput,
    ),
  description:
    "Compute the total wind speed from its headwind and crosswind components.",
  id: "aviation/wind-speed-from-components",
  inputs: [
    {
      description:
        "Headwind component along the course; positive is a headwind, negative a tailwind.",
      id: "headwindComponent",
      kind: "number",
      label: "Headwind component",
      unit: "kt",
    },
    {
      description:
        "Crosswind component across the course; positive is from the right, negative from the left.",
      id: "crosswindComponent",
      kind: "number",
      label: "Crosswind component",
      unit: "kt",
    },
  ],
  outputs: [
    {
      description: "Total wind speed magnitude.",
      format: "speed",
      id: "windSpeedKt",
      kind: "number",
      label: "Wind speed",
      unit: "kt",
    },
  ],
  title: "Wind Speed from Components Calculator",
});
export const runWindSpeedFromComponents = windSpeedFromComponentsTool.execute;
export default windSpeedFromComponentsTool;
