import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TakeoffSpeedInput = {
  readonly capabilityDevelopmentPercent: number;
  readonly deploymentSpeedPercent: number;
  readonly fastScoreThreshold: number;
  readonly slowScoreThreshold: number;
};

export type TakeoffSpeedOutput = {
  readonly classification: "fast" | "slow" | "standard";
  readonly speedScore: number;
};

export const classifyTakeoffSpeed = (
  input: TakeoffSpeedInput,
): TakeoffSpeedOutput => {
  for (const [field, value] of [
    ["capabilityDevelopmentPercent", input.capabilityDevelopmentPercent],
    ["deploymentSpeedPercent", input.deploymentSpeedPercent],
    ["fastScoreThreshold", input.fastScoreThreshold],
    ["slowScoreThreshold", input.slowScoreThreshold],
  ] as const)
    if (!Number.isFinite(value) || value < 0 || value > 100)
      simpleError(
        field,
        "Scores and thresholds must be finite values from 0 through 100.",
        "takeoff_score_out_of_range",
      );
  if (input.fastScoreThreshold < input.slowScoreThreshold)
    simpleError(
      "fastScoreThreshold",
      "Fast threshold must be at least the slow threshold.",
      "invalid_takeoff_thresholds",
    );
  const speedScore =
    (input.capabilityDevelopmentPercent + input.deploymentSpeedPercent) / 2;
  return {
    classification:
      speedScore >= input.fastScoreThreshold
        ? "fast"
        : speedScore <= input.slowScoreThreshold
          ? "slow"
          : "standard",
    speedScore,
  };
};

export const takeoffSpeedExample = {
  input: {
    capabilityDevelopmentPercent: 90,
    deploymentSpeedPercent: 80,
    fastScoreThreshold: 80,
    slowScoreThreshold: 30,
  },
  output: { classification: "fast", speedScore: 85 },
} satisfies ToolExample<TakeoffSpeedInput, TakeoffSpeedOutput>;

export const takeoffSpeedTool = createSimpleTool({
  calculate: (input) =>
    classifyTakeoffSpeed({
      capabilityDevelopmentPercent:
        input.capabilityDevelopmentPercent as number,
      deploymentSpeedPercent: input.deploymentSpeedPercent as number,
      fastScoreThreshold: input.fastScoreThreshold as number,
      slowScoreThreshold: input.slowScoreThreshold as number,
    }),
  description:
    "Classify a takeoff scenario as fast, standard, or slow from two caller-supplied capability and deployment scores.",
  id: "futurology/takeoff-speed-fast-slow-scenario-classifier",
  inputs: [
    {
      id: "capabilityDevelopmentPercent",
      kind: "number",
      label: "Capability development score",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "deploymentSpeedPercent",
      kind: "number",
      label: "Deployment speed score",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "fastScoreThreshold",
      kind: "number",
      label: "Fast score threshold",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "slowScoreThreshold",
      kind: "number",
      label: "Slow score threshold",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      enum: ["fast", "slow", "standard"],
      id: "classification",
      kind: "string",
      label: "Takeoff speed",
    },
    {
      id: "speedScore",
      kind: "number",
      label: "Average speed score",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  title: "Takeoff Speed Fast Slow Scenario Classifier",
});

export const runTakeoffSpeed = takeoffSpeedTool.execute;
export default takeoffSpeedTool;
