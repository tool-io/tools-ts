import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VhfLineOfSightRangeInput = {
  readonly shoreAntennaFeet: number;
  readonly vesselAntennaFeet: number;
};

export type VhfLineOfSightRangeOutput = {
  readonly communicationRangeNm: number;
};

export const vhfLineOfSightRangeExample = {
  input: { shoreAntennaFeet: 64, vesselAntennaFeet: 9 },
  output: { communicationRangeNm: 12.87 },
} satisfies ToolExample<VhfLineOfSightRangeInput, VhfLineOfSightRangeOutput>;

export const calculateVhfLineOfSightRange = (
  input: VhfLineOfSightRangeInput,
): VhfLineOfSightRangeOutput => {
  if (input.vesselAntennaFeet <= 0)
    simpleError(
      "vesselAntennaFeet",
      "Vessel antenna height must be positive.",
      "invalid_input",
    );
  if (input.shoreAntennaFeet <= 0)
    simpleError(
      "shoreAntennaFeet",
      "Shore antenna height must be positive.",
      "invalid_input",
    );
  return {
    communicationRangeNm:
      1.17 *
      (Math.sqrt(input.vesselAntennaFeet) + Math.sqrt(input.shoreAntennaFeet)),
  };
};

export const vhfLineOfSightRangeTool = createSimpleTool({
  calculate: (input) =>
    calculateVhfLineOfSightRange(input as unknown as VhfLineOfSightRangeInput),
  description:
    "Estimate very high frequency radio range over water as one point one seven times the sum of the square roots of the vessel and shore antenna heights in feet.",
  id: "sailing/vhf-line-of-sight-range",
  inputs: [
    {
      description: "Height of the shore station antenna above sea level.",
      format: "length-ft",
      id: "shoreAntennaFeet",
      kind: "number",
      label: "Shore antenna height",
      unit: "ft",
    },
    {
      description: "Height of the vessel antenna above the sea surface.",
      format: "length-ft",
      id: "vesselAntennaFeet",
      kind: "number",
      label: "Vessel antenna height",
      unit: "ft",
    },
  ],
  outputs: [
    {
      description:
        "Approximate line of sight communication range to the horizon.",
      format: "length-nm",
      id: "communicationRangeNm",
      kind: "number",
      label: "Communication range",
      unit: "NM",
    },
  ],
  title: "VHF Range Calculator",
});
export const runVhfLineOfSightRange = vhfLineOfSightRangeTool.execute;
export default vhfLineOfSightRangeTool;
