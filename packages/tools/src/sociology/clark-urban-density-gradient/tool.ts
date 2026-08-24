import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ClarkUrbanDensityGradientInput = {
  readonly density1: number;
  readonly density2: number;
  readonly distance1Km?: number;
  readonly distance2Km: number;
};

export type ClarkUrbanDensityGradientOutput = {
  readonly gradientCoefficient: number;
};

export const clarkUrbanDensityGradientExample = {
  input: {
    density1: 10000,
    density2: 2000,
    distance1Km: 0,
    distance2Km: 5,
  },
  output: {
    gradientCoefficient: 0.32188758248682026,
  },
} satisfies ToolExample<
  ClarkUrbanDensityGradientInput,
  ClarkUrbanDensityGradientOutput
>;

export const calculateClarkGradient = (
  input: ClarkUrbanDensityGradientInput,
): ClarkUrbanDensityGradientOutput => {
  const innerDistance = input.distance1Km ?? 0;
  if (
    !Number.isFinite(input.density1) ||
    !Number.isFinite(input.density2) ||
    input.density1 <= 0 ||
    input.density2 <= 0
  )
    simpleError(
      "density1",
      "Densities must be positive to take their logarithmic ratio.",
      "invalid_value",
    );
  if (
    !Number.isFinite(innerDistance) ||
    !Number.isFinite(input.distance2Km) ||
    innerDistance < 0 ||
    input.distance2Km <= innerDistance
  )
    simpleError(
      "distance2Km",
      "The outer measurement distance must be greater than the nonnegative inner distance.",
      "invalid_value",
    );
  const span = input.distance2Km - innerDistance;
  const gradientCoefficient =
    (Math.log(input.density1) - Math.log(input.density2)) / span;
  if (!Number.isFinite(gradientCoefficient))
    simpleError(
      "distance2Km",
      "The density gradient is outside the finite numeric range.",
      "numeric_range",
    );
  return {
    gradientCoefficient,
  };
};

export const clarkUrbanDensityGradientTool = createSimpleTool({
  calculate: (input) =>
    calculateClarkGradient({
      density1: input.density1 as number,
      density2: input.density2 as number,
      distance1Km: input.distance1Km as number,
      distance2Km: input.distance2Km as number,
    }),
  description:
    "Fit the negative exponential of Clark's urban density model between two ring measurements.",
  id: "sociology/clark-urban-density-gradient",
  inputs: [
    {
      description: "Population density at the inner measurement.",
      id: "density1",
      kind: "number",
      label: "Inner density",
      minimum: 0,
    },
    {
      description: "Population density at the outer measurement.",
      id: "density2",
      kind: "number",
      label: "Outer density",
      minimum: 0,
    },
    {
      default: 0,
      description: "Distance of the inner ring from the center.",
      id: "distance1Km",
      kind: "number",
      label: "Inner distance",
      minimum: 0,
      unit: "km",
    },
    {
      description: "Distance of the outer ring from the center.",
      id: "distance2Km",
      kind: "number",
      label: "Outer distance",
      minimum: 0,
      unit: "km",
    },
  ],
  outputs: [
    {
      description:
        "Negative exponential decay coefficient; steeper values fall off faster from the core.",
      id: "gradientCoefficient",
      kind: "number",
      label: "Density gradient",
      unit: "1/km",
    },
  ],
  title: "Clark Urban Density Gradient Calculator",
});
export const runClarkUrbanDensityGradient =
  clarkUrbanDensityGradientTool.execute;
export default clarkUrbanDensityGradientTool;
