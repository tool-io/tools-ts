import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type RiserHeightCheckInput = {
  readonly riserHeightCm: number;
};

export type RiserHeightCheckOutput = {
  readonly deviationFromIdealCm: number;
  readonly isIdealRiser: boolean;
};

export const riserHeightCheckExample = {
  input: { riserHeightCm: 17 },
  output: { deviationFromIdealCm: 0, isIdealRiser: true },
} satisfies ToolExample<RiserHeightCheckInput, RiserHeightCheckOutput>;

export const riserHeightCheckTool = createSimpleTool({
  id: "carpentry/treppen-steigung-17-18-ideal",
  title: "Riser Height Check",
  description:
    "Check whether a stair riser height falls in the ideal 17 to 18 cm range and report its deviation in centimeters.",
  inputs: [
    {
      description: "Riser height in centimeters.",
      id: "riserHeightCm",
      kind: "number",
      label: "Riser height",
      maximum: 25,
      minimum: 10,
      unit: "cm",
    },
  ],
  outputs: [
    {
      description:
        "True when the riser height is between 17 and 18 cm inclusive.",
      id: "isIdealRiser",
      kind: "boolean",
      label: "Is ideal riser",
    },
    {
      description:
        "Deviation from the ideal 17 to 18 cm range in centimeters, zero inside the range.",
      id: "deviationFromIdealCm",
      kind: "number",
      label: "Deviation from ideal",
      unit: "cm",
    },
  ],
  calculate: (input) => {
    const riserHeightCm = input.riserHeightCm as number;
    return {
      deviationFromIdealCm: Math.max(0, 17 - riserHeightCm, riserHeightCm - 18),
      isIdealRiser: riserHeightCm >= 17 && riserHeightCm <= 18,
    };
  },
});
export const runRiserHeightCheck = riserHeightCheckTool.execute;
export default riserHeightCheckTool;
