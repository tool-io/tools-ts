import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type RunwaySlopeFactorInput = {
  readonly distanceChangePercentPerSlopePercent: number;
  readonly slopePercent: number;
};

export type RunwaySlopeFactorOutput = {
  readonly distanceFactorPercent: number;
};

export const runwaySlopeFactorExample = {
  input: { distanceChangePercentPerSlopePercent: 10, slopePercent: 2 },
  output: { distanceFactorPercent: 20 },
} satisfies ToolExample<RunwaySlopeFactorInput, RunwaySlopeFactorOutput>;

export const calculateRunwaySlopeFactor = (
  input: RunwaySlopeFactorInput,
): RunwaySlopeFactorOutput => ({
  distanceFactorPercent:
    input.slopePercent * input.distanceChangePercentPerSlopePercent,
});

export const runwaySlopeFactorTool = createSimpleTool({
  calculate: (input) =>
    calculateRunwaySlopeFactor(input as unknown as RunwaySlopeFactorInput),
  description:
    "Apply a user-supplied distance-change rate to runway slope for scenario comparison, not approved aircraft performance.",
  id: "aviation/runway-slope-factor",
  inputs: [
    {
      description:
        "Distance change for each percentage point of slope; obtain an applicable value from approved data.",
      id: "distanceChangePercentPerSlopePercent",
      kind: "number",
      label: "Distance change per slope point",
      maximum: 100,
      minimum: 0,
      unit: "%/%",
    },
    {
      description:
        "Runway slope in percent; positive is uphill, negative is downhill.",
      id: "slopePercent",
      kind: "number",
      label: "Slope",
      maximum: 15,
      minimum: -15,
      unit: "%",
    },
  ],
  outputs: [
    {
      description:
        "Percentage adjustment applied to the required runway distance.",
      id: "distanceFactorPercent",
      kind: "number",
      label: "Distance factor",
      unit: "%",
    },
  ],
  title: "Runway Slope Scenario Factor Calculator",
});
export const runRunwaySlopeFactor = runwaySlopeFactorTool.execute;
export default runwaySlopeFactorTool;
