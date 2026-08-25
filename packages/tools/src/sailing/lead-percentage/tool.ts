import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LeadPercentageInput = {
  readonly centroidDistanceMeters: number;
  readonly waterlineLengthMeters: number;
};

export type LeadPercentageOutput = {
  readonly leadPercent: number;
};

export const leadPercentageExample = {
  input: { centroidDistanceMeters: 0.75, waterlineLengthMeters: 10 },
  output: { leadPercent: 7.5 },
} satisfies ToolExample<LeadPercentageInput, LeadPercentageOutput>;

export const leadPercentageTool = createSimpleTool({
  calculate: (input) => {
    const centroidDistanceMeters = input.centroidDistanceMeters as number;
    const waterlineLengthMeters = input.waterlineLengthMeters as number;
    if (waterlineLengthMeters <= 0)
      simpleError(
        "waterlineLengthMeters",
        "Waterline length must be positive.",
        "invalid_lwl",
      );
    return {
      leadPercent: (centroidDistanceMeters / waterlineLengthMeters) * 100,
    };
  },
  description:
    "Compute sail lead as leadPercent = centroidDistanceMeters / waterlineLengthMeters * 100; signed distances allow the centroid to fall aft of the reference.",
  id: "sailing/lead-percentage",
  inputs: [
    {
      description:
        "Signed horizontal distance from the foretriangle centroid reference to the lead point.",
      id: "centroidDistanceMeters",
      kind: "number",
      label: "Centroid distance",
      unit: "m",
    },
    {
      description: "Length of the design waterline.",
      id: "waterlineLengthMeters",
      kind: "number",
      label: "Waterline length",
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [
    {
      description: "Lead expressed as a percentage of the waterline length.",
      id: "leadPercent",
      kind: "number",
      label: "Lead percentage",
      unit: "%",
    },
  ],
  title: "Lead Percentage Calculator",
});
export const runLeadPercentage = leadPercentageTool.execute;
export default leadPercentageTool;
