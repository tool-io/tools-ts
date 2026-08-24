import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GravityFlowIndexRavensteinInput = {
  readonly destinationPopulation: number;
  readonly distanceKm: number;
  readonly originPopulation: number;
};

export type GravityFlowIndexRavensteinOutput = {
  readonly gravityFlowIndex: number;
};

export const gravityFlowIndexRavensteinExample = {
  input: {
    destinationPopulation: 500000,
    distanceKm: 100,
    originPopulation: 1000000,
  },
  output: {
    gravityFlowIndex: 50000000,
  },
} satisfies ToolExample<
  GravityFlowIndexRavensteinInput,
  GravityFlowIndexRavensteinOutput
>;

export const calculateGravityFlowIndex = (
  input: GravityFlowIndexRavensteinInput,
): GravityFlowIndexRavensteinOutput => {
  if (!Number.isFinite(input.distanceKm) || input.distanceKm <= 0)
    simpleError(
      "distanceKm",
      "The separation distance must be positive.",
      "invalid_value",
    );
  if (
    !Number.isFinite(input.originPopulation) ||
    !Number.isFinite(input.destinationPopulation) ||
    input.originPopulation < 0 ||
    input.destinationPopulation < 0
  )
    simpleError(
      "originPopulation",
      "Both place populations must be finite nonnegative numbers.",
      "invalid_value",
    );
  const gravityFlowIndex =
    (input.originPopulation / input.distanceKm) *
    (input.destinationPopulation / input.distanceKm);
  if (!Number.isFinite(gravityFlowIndex))
    simpleError(
      "originPopulation",
      "The gravity index is outside the finite numeric range.",
      "numeric_range",
    );
  return { gravityFlowIndex };
};

export const gravityFlowIndexRavensteinTool = createSimpleTool({
  calculate: (input) =>
    calculateGravityFlowIndex({
      destinationPopulation: input.destinationPopulation as number,
      distanceKm: input.distanceKm as number,
      originPopulation: input.originPopulation as number,
    }),
  description:
    "Rank migration potential between two places with the gravity model product of populations over squared distance.",
  id: "sociology/gravity-flow-index-ravenstein",
  inputs: [
    {
      description: "Population at the destination.",
      id: "destinationPopulation",
      kind: "number",
      label: "Destination population",
      minimum: 0,
    },
    {
      description: "Distance separating the two places.",
      id: "distanceKm",
      kind: "number",
      label: "Distance",
      minimum: Number.MIN_VALUE,
      unit: "km",
    },
    {
      description: "Population at the origin.",
      id: "originPopulation",
      kind: "number",
      label: "Origin population",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Gravity potential; higher values predict larger interaction flows.",
      id: "gravityFlowIndex",
      kind: "number",
      label: "Gravity index",
    },
  ],
  title: "Ravenstein Gravity Flow Index Calculator",
});
export const runGravityFlowIndexRavenstein =
  gravityFlowIndexRavensteinTool.execute;
export default gravityFlowIndexRavensteinTool;
