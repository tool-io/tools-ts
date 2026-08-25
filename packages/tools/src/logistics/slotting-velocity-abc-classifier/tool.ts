import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SlottingVelocityAbcClassifierInput = {
  readonly cumulativeThroughputSharePercent: number;
  readonly fastMovingBoundaryPercent?: number;
  readonly slowMovingBoundaryPercent?: number;
};

export type SlottingVelocityAbcClassifierOutput = {
  readonly velocityClass: "A" | "B" | "C";
};

export const calculateSlottingVelocityAbcClassifier = (
  input: SlottingVelocityAbcClassifierInput,
): SlottingVelocityAbcClassifierOutput => {
  if (
    !Number.isFinite(input.cumulativeThroughputSharePercent) ||
    input.cumulativeThroughputSharePercent <= 0 ||
    input.cumulativeThroughputSharePercent > 100
  )
    return simpleError(
      "cumulativeThroughputSharePercent",
      "The cumulative share must be between zero and one hundred percent.",
      "invalid_percent",
    );
  const fastMovingBoundaryPercent = input.fastMovingBoundaryPercent ?? 80;
  const slowMovingBoundaryPercent = input.slowMovingBoundaryPercent ?? 95;
  if (
    !Number.isFinite(fastMovingBoundaryPercent) ||
    fastMovingBoundaryPercent <= 0 ||
    fastMovingBoundaryPercent >= 100
  )
    return simpleError(
      "fastMovingBoundaryPercent",
      "The A boundary must be greater than zero percent.",
      "invalid_threshold",
    );
  if (
    !Number.isFinite(slowMovingBoundaryPercent) ||
    slowMovingBoundaryPercent <= fastMovingBoundaryPercent ||
    slowMovingBoundaryPercent > 100
  )
    return simpleError(
      "slowMovingBoundaryPercent",
      "The B boundary must exceed the A boundary and be at most one hundred percent.",
      "invalid_threshold",
    );
  return {
    velocityClass:
      input.cumulativeThroughputSharePercent <= fastMovingBoundaryPercent
        ? "A"
        : input.cumulativeThroughputSharePercent <= slowMovingBoundaryPercent
          ? "B"
          : "C",
  };
};

export const slottingVelocityAbcClassifierExample = {
  input: { cumulativeThroughputSharePercent: 74.2 },
  output: { velocityClass: "A" },
} satisfies ToolExample<
  SlottingVelocityAbcClassifierInput,
  SlottingVelocityAbcClassifierOutput
>;

export const slottingVelocityAbcClassifierTool = createSimpleTool({
  id: "logistics/slotting-velocity-abc-classifier",
  title: "Slotting Velocity ABC Classifier",
  description:
    "Pareto-slot an item by its cumulative share of pick throughput: A up to the first boundary (default 80%), B to the second (default 95%), C beyond; boundaries are inputs.",
  inputs: [
    {
      description:
        "Item's cumulative share of total pick throughput in percent, from a rank-ordered velocity report.",
      id: "cumulativeThroughputSharePercent",
      kind: "number",
      label: "Cumulative %",
      minimum: Number.MIN_VALUE,
      maximum: 100,
      unit: "%",
    },
    {
      default: 80,
      description: "Cumulative-share ceiling for class A.",
      id: "fastMovingBoundaryPercent",
      kind: "number",
      label: "A boundary",
      minimum: Number.MIN_VALUE,
      maximum: 99.99999999999999,
      unit: "%",
    },
    {
      default: 95,
      description: "Cumulative-share ceiling for class B.",
      id: "slowMovingBoundaryPercent",
      kind: "number",
      label: "B boundary",
      minimum: Number.MIN_VALUE,
      maximum: 100,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Velocity class used for slot placement.",
      id: "velocityClass",
      enum: ["A", "B", "C"],
      kind: "string",
      label: "Class",
    },
  ],
  calculate: (input) =>
    calculateSlottingVelocityAbcClassifier({
      cumulativeThroughputSharePercent:
        input.cumulativeThroughputSharePercent as number,
      fastMovingBoundaryPercent: input.fastMovingBoundaryPercent as
        number | undefined,
      slowMovingBoundaryPercent: input.slowMovingBoundaryPercent as
        number | undefined,
    }),
});

export const runSlottingVelocityAbcClassifier =
  slottingVelocityAbcClassifierTool.execute;
export default slottingVelocityAbcClassifierTool;
