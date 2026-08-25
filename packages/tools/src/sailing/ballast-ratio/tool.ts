import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BallastRatioInput = {
  readonly ballastWeightPounds: number;
  readonly displacementPounds: number;
};

export type BallastRatioOutput = {
  readonly ballastRatioPercent: number;
};

export const ballastRatioExample = {
  input: { ballastWeightPounds: 4000, displacementPounds: 10000 },
  output: { ballastRatioPercent: 40 },
} satisfies ToolExample<BallastRatioInput, BallastRatioOutput>;

export const ballastRatioTool = createSimpleTool({
  calculate: (input) => {
    const displacementPounds = input.displacementPounds as number;
    if (displacementPounds <= 0)
      simpleError(
        "displacementPounds",
        "Displacement must be positive.",
        "invalid_input",
      );
    const ballastWeightPounds = input.ballastWeightPounds as number;
    if (ballastWeightPounds < 0 || ballastWeightPounds > displacementPounds)
      simpleError(
        "ballastWeightPounds",
        "Ballast weight must be non-negative and not exceed displacement.",
        "invalid_ballast_weight",
      );
    return {
      ballastRatioPercent: (ballastWeightPounds / displacementPounds) * 100,
    };
  },
  description:
    "Compute a sailboat's ballast ratio using ballastRatioPercent = ballastWeightPounds / displacementPounds * 100.",
  id: "sailing/ballast-ratio",
  inputs: [
    {
      description: "Weight of the ballast keel.",
      id: "ballastWeightPounds",
      kind: "number",
      label: "Ballast weight",
      unit: "lb",
    },
    {
      description: "Total displacement of the vessel.",
      id: "displacementPounds",
      kind: "number",
      label: "Displacement",
      unit: "lb",
    },
  ],
  outputs: [
    {
      description: "Ballast weight as a percentage of displacement.",
      id: "ballastRatioPercent",
      kind: "number",
      label: "Ballast ratio",
      unit: "%",
    },
  ],
  title: "Ballast Ratio Calculator",
});
export const runBallastRatio = ballastRatioTool.execute;
export default ballastRatioTool;
