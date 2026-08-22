import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WindDirectionFromComponentsInput = {
  readonly headwindComponent: number;
  readonly crosswindComponent: number;
};

export type WindDirectionFromComponentsOutput = {
  readonly windDirectionDeg: number;
};

const normalizeDegrees = (value: number): number => ((value % 360) + 360) % 360;

export const windDirectionFromComponentsExample = {
  input: { headwindComponent: 10, crosswindComponent: 10 },
  output: { windDirectionDeg: 45 },
} satisfies ToolExample<
  WindDirectionFromComponentsInput,
  WindDirectionFromComponentsOutput
>;

export const calculateWindDirectionFromComponents = (
  input: WindDirectionFromComponentsInput,
): WindDirectionFromComponentsOutput => {
  if (input.headwindComponent === 0 && input.crosswindComponent === 0)
    simpleError(
      "headwindComponent",
      "Both components are zero, so the wind direction is undefined.",
      "zero_wind",
    );
  return {
    windDirectionDeg: normalizeDegrees(
      (Math.atan2(input.crosswindComponent, input.headwindComponent) * 180) /
        Math.PI,
    ),
  };
};

export const windDirectionFromComponentsTool = createSimpleTool({
  calculate: (input) =>
    calculateWindDirectionFromComponents(
      input as unknown as WindDirectionFromComponentsInput,
    ),
  description:
    "Recover the relative wind direction from headwind and crosswind components.",
  id: "aviation/wind-direction-from-components",
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
      description:
        "Relative wind direction in degrees clockwise from the course, normalized to zero through 360.",
      format: "angle",
      id: "windDirectionDeg",
      kind: "number",
      label: "Wind direction",
      unit: "°",
    },
  ],
  title: "Wind Direction from Components Calculator",
});
export const runWindDirectionFromComponents =
  windDirectionFromComponentsTool.execute;
export default windDirectionFromComponentsTool;
