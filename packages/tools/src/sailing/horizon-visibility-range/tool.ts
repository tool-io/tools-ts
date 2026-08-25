import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HorizonVisibilityRangeInput = {
  readonly observerHeightFeet: number;
};

export type HorizonVisibilityRangeOutput = {
  readonly horizonRangeNm: number;
};

const HORIZON_COEFFICIENT_NM_PER_SQRT_FT = 1.17;

export const horizonVisibilityRangeExample = {
  input: { observerHeightFeet: 9 },
  output: { horizonRangeNm: 3.51 },
} satisfies ToolExample<
  HorizonVisibilityRangeInput,
  HorizonVisibilityRangeOutput
>;

export const calculateHorizonVisibilityRange = (
  input: HorizonVisibilityRangeInput,
): HorizonVisibilityRangeOutput => {
  if (input.observerHeightFeet < 0)
    simpleError(
      "observerHeightFeet",
      "Observer height cannot be negative.",
      "invalid_input",
    );
  return {
    horizonRangeNm:
      HORIZON_COEFFICIENT_NM_PER_SQRT_FT * Math.sqrt(input.observerHeightFeet),
  };
};

export const horizonVisibilityRangeTool = createSimpleTool({
  calculate: (input) =>
    calculateHorizonVisibilityRange(
      input as unknown as HorizonVisibilityRangeInput,
    ),
  description:
    "Compute the distance to the visible horizon in nautical miles as one point one seven times the square root of the observer height in feet.",
  id: "sailing/horizon-visibility-range",
  inputs: [
    {
      description:
        "Height of the observer's eye above the sea surface; uses the one point one seven horizon coefficient.",
      format: "length-ft",
      id: "observerHeightFeet",
      kind: "number",
      label: "Observer height",
      minimum: 0,
      unit: "ft",
    },
  ],
  outputs: [
    {
      description:
        "Distance in nautical miles at which the sea horizon meets the line of sight.",
      format: "length-nm",
      id: "horizonRangeNm",
      kind: "number",
      label: "Horizon range",
      unit: "NM",
    },
  ],
  title: "Horizon Range Calculator",
});
export const runHorizonVisibilityRange = horizonVisibilityRangeTool.execute;
export default horizonVisibilityRangeTool;
