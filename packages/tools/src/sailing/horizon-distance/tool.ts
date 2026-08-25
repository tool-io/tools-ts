import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HorizonDistanceInput = {
  readonly heightAboveWaterFeet: number;
};

export type HorizonDistanceOutput = {
  readonly horizonDistanceNm: number;
};

export const HORIZON_COEFFICIENT_NM_PER_SQRT_FT = 1.17;

export const horizonDistanceExample = {
  input: { heightAboveWaterFeet: 9 },
  output: { horizonDistanceNm: 3.51 },
} satisfies ToolExample<HorizonDistanceInput, HorizonDistanceOutput>;

export const calculateHorizonDistance = (
  input: HorizonDistanceInput,
): HorizonDistanceOutput => {
  if (input.heightAboveWaterFeet < 0)
    simpleError(
      "heightAboveWaterFeet",
      "Height above water cannot be negative.",
      "invalid_input",
    );
  return {
    horizonDistanceNm:
      HORIZON_COEFFICIENT_NM_PER_SQRT_FT *
      Math.sqrt(input.heightAboveWaterFeet),
  };
};

export const horizonDistanceTool = createSimpleTool({
  calculate: (input) =>
    calculateHorizonDistance(input as unknown as HorizonDistanceInput),
  description:
    "Compute the distance to the visible horizon in nautical miles as the coefficient one point one seven times the square root of eye height in feet.",
  id: "sailing/horizon-distance",
  inputs: [
    {
      description:
        "Height of the observer above the water surface; uses the standard coefficient of one point one seven nautical miles per square root foot.",
      format: "length-ft",
      id: "heightAboveWaterFeet",
      kind: "number",
      label: "Height above water",
      minimum: 0,
      unit: "ft",
    },
  ],
  outputs: [
    {
      description:
        "Distance to the horizon at the standard one point one seven coefficient.",
      format: "length-nm",
      id: "horizonDistanceNm",
      kind: "number",
      label: "Horizon distance",
      unit: "NM",
    },
  ],
  title: "Horizon Distance Calculator",
});
export const runHorizonDistance = horizonDistanceTool.execute;
export default horizonDistanceTool;
