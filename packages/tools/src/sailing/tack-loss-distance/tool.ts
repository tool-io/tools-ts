import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TackLossDistanceInput = {
  readonly tackCount: number;
  readonly boatLengthMeters: number;
  readonly boatLengthsLostPerTack?: number;
};

export type TackLossDistanceOutput = {
  readonly distanceLostNm: number;
};

const DEFAULT_BOAT_LENGTHS_LOST_PER_TACK = 4;

export const tackLossDistanceExample = {
  input: { tackCount: 6, boatLengthMeters: 40 },
  output: { distanceLostNm: 0.5183585313174947 },
} satisfies ToolExample<TackLossDistanceInput, TackLossDistanceOutput>;

export const calculateTackLossDistance = (
  input: TackLossDistanceInput,
): TackLossDistanceOutput => {
  if (!(input.boatLengthMeters > 0))
    simpleError(
      "boatLengthMeters",
      "Boat length must be positive.",
      "invalid_length",
    );
  return {
    distanceLostNm:
      (input.tackCount *
        input.boatLengthMeters *
        (input.boatLengthsLostPerTack ?? DEFAULT_BOAT_LENGTHS_LOST_PER_TACK)) /
      1852,
  };
};

export const tackLossDistanceTool = createSimpleTool({
  id: "sailing/tack-loss-distance",
  title: "Tack Loss Distance",
  description:
    "Estimate the distance lost to tacking from the number of tacks, boat length, and boat lengths lost per tack.",
  inputs: [
    {
      description: "Number of tacks performed.",
      id: "tackCount",
      kind: "integer",
      label: "Tack count",
      minimum: 1,
    },
    {
      description: "Overall length of the boat.",
      id: "boatLengthMeters",
      kind: "number",
      label: "Boat length",
      unit: "m",
    },
    {
      default: DEFAULT_BOAT_LENGTHS_LOST_PER_TACK,
      description: "Boat lengths lost for each tack.",
      id: "boatLengthsLostPerTack",
      kind: "number",
      label: "Boat lengths lost per tack",
      maximum: 10,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Total distance lost to tacking.",
      format: "length-nm",
      id: "distanceLostNm",
      kind: "number",
      label: "Distance lost",
      unit: "nm",
    },
  ],
  calculate: (input) =>
    calculateTackLossDistance(input as unknown as TackLossDistanceInput),
});

export const runTackLossDistance = tackLossDistanceTool.execute;
export default tackLossDistanceTool;
