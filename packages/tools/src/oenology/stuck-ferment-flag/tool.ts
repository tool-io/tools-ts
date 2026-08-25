import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StuckFermentFlagInput = {
  readonly currentSg: number;
  readonly residualSugarGPerL?: number;
  readonly stuckResidualThresholdGPerL?: number;
};

export type StuckFermentFlagOutput = {
  readonly stuckFermentation: boolean;
};

export const stuckFermentFlagExample = {
  input: {
    currentSg: 1.01,
    residualSugarGPerL: 8,
    stuckResidualThresholdGPerL: 5,
  },
  output: {
    stuckFermentation: true,
  },
} satisfies ToolExample<StuckFermentFlagInput, StuckFermentFlagOutput>;

export const calculateStuckFermentFlag = (
  input: StuckFermentFlagInput,
): StuckFermentFlagOutput => {
  const threshold = input.stuckResidualThresholdGPerL ?? 5;
  if (threshold < 0)
    simpleError(
      "stuckResidualThresholdGPerL",
      "The residual sugar threshold cannot be negative.",
      "invalid_value",
    );
  const residual = input.residualSugarGPerL ?? 0;
  return {
    stuckFermentation: residual >= threshold && input.currentSg > 0.995,
  };
};

export const stuckFermentFlagTool = createSimpleTool({
  calculate: (input) =>
    calculateStuckFermentFlag(input as unknown as StuckFermentFlagInput),
  description:
    "Flag a likely stuck or stalled fermentation when residual sugar stays above the cellar threshold while gravity remains above dryness.",
  id: "oenology/stuck-ferment-flag",
  inputs: [
    {
      description: "Latest specific gravity of the fermenting must.",
      id: "currentSg",
      label: "Current gravity",
      kind: "number",
      minimum: 0,
    },
    {
      default: 0,
      description: "Measured residual sugar in the sample.",
      id: "residualSugarGPerL",
      kind: "number",
      label: "Residual sugar",
      minimum: 0,
      unit: "g/L",
    },
    {
      default: 5,
      description:
        "Residual sugar at or above this level counts as unfinished.",
      id: "stuckResidualThresholdGPerL",
      kind: "number",
      label: "Residual threshold",
      minimum: 0,
      unit: "g/L",
    },
  ],
  outputs: [
    {
      description: "True when the lot looks stuck or stalled.",
      id: "stuckFermentation",
      kind: "boolean",
      label: "Stuck fermentation",
    },
  ],
  title: "Stuck Fermentation Residual Sugar Flag",
});
export const runStuckFermentFlag = stuckFermentFlagTool.execute;
export default stuckFermentFlagTool;
