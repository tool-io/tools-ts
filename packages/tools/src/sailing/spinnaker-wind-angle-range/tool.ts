import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type SpinnakerWindAngleRangeInput = {
  readonly sailType: string;
};

export type SpinnakerWindAngleRangeOutput = {
  readonly maxTwaDeg: number;
  readonly minTwaDeg: number;
};

const MIN_TWA_DEG: Record<string, number> = {
  asymmetric: 95,
  symmetric: 110,
};

const MAX_TWA_DEG: Record<string, number> = {
  asymmetric: 155,
  symmetric: 175,
};

export const spinnakerWindAngleRangeExample = {
  input: { sailType: "symmetric" },
  output: { maxTwaDeg: 175, minTwaDeg: 110 },
} satisfies ToolExample<
  SpinnakerWindAngleRangeInput,
  SpinnakerWindAngleRangeOutput
>;

export const spinnakerWindAngleRangeTool = createSimpleTool({
  calculate: (input) => {
    const sailType = input.sailType as string;
    return {
      maxTwaDeg: MAX_TWA_DEG[sailType],
      minTwaDeg: MIN_TWA_DEG[sailType],
    };
  },
  description:
    "Look up the true wind angle band for carrying a spinnaker, with symmetric sails trimmed from 110 to 175 degrees and asymmetric sails from 95 to 155 degrees.",
  id: "sailing/spinnaker-wind-angle-range",
  inputs: [
    {
      description: "Spinnaker style carried aboard.",
      enum: ["asymmetric", "symmetric"],
      id: "sailType",
      kind: "string",
      label: "Sail type",
    },
  ],
  outputs: [
    {
      description: "Deepest true wind angle before dropping on a run.",
      id: "maxTwaDeg",
      kind: "number",
      label: "Maximum TWA",
      unit: "deg",
    },
    {
      description: "Shallowest true wind angle before the sail stalls.",
      id: "minTwaDeg",
      kind: "number",
      label: "Minimum TWA",
      unit: "deg",
    },
  ],
  title: "Spinnaker Wind Angle Range",
});
export const runSpinnakerWindAngleRange = spinnakerWindAngleRangeTool.execute;
export default spinnakerWindAngleRangeTool;
