import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AisDetectionRangeInput = {
  readonly ownAntennaFeet: number;
  readonly targetAntennaFeet: number;
};

export type AisDetectionRangeOutput = {
  readonly detectionRangeNm: number;
};

export const aisDetectionRangeExample = {
  input: { ownAntennaFeet: 9, targetAntennaFeet: 49 },
  output: { detectionRangeNm: 11.7 },
} satisfies ToolExample<AisDetectionRangeInput, AisDetectionRangeOutput>;

export const calculateAisDetectionRange = (
  input: AisDetectionRangeInput,
): AisDetectionRangeOutput => {
  if (input.ownAntennaFeet <= 0)
    simpleError(
      "ownAntennaFeet",
      "Own antenna height must be positive.",
      "invalid_input",
    );
  if (input.targetAntennaFeet <= 0)
    simpleError(
      "targetAntennaFeet",
      "Target antenna height must be positive.",
      "invalid_input",
    );
  return {
    detectionRangeNm:
      1.17 *
      (Math.sqrt(input.ownAntennaFeet) + Math.sqrt(input.targetAntennaFeet)),
  };
};

export const aisDetectionRangeTool = createSimpleTool({
  calculate: (input) =>
    calculateAisDetectionRange(input as unknown as AisDetectionRangeInput),
  description:
    "Estimate the range at which an automatic identification system target is received as one point one seven times the sum of the square roots of the own and target antenna heights in feet.",
  id: "sailing/ais-detection-range",
  inputs: [
    {
      description:
        "Height of the own vessel AIS antenna above the sea surface.",
      format: "length-ft",
      id: "ownAntennaFeet",
      kind: "number",
      label: "Own antenna height",
      unit: "ft",
    },
    {
      description:
        "Height of the target vessel AIS antenna above the sea surface.",
      format: "length-ft",
      id: "targetAntennaFeet",
      kind: "number",
      label: "Target antenna height",
      unit: "ft",
    },
  ],
  outputs: [
    {
      description: "Approximate detection range between the two antennas.",
      format: "length-nm",
      id: "detectionRangeNm",
      kind: "number",
      label: "Detection range",
      unit: "NM",
    },
  ],
  title: "AIS Range Estimate",
});
export const runAisDetectionRange = aisDetectionRangeTool.execute;
export default aisDetectionRangeTool;
