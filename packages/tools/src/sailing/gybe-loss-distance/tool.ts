import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GybeLossDistanceInput = {
  readonly gybeCount: number;
  readonly boatLengthMeters: number;
  readonly boatLengthsLostPerGybe?: number;
};

export type GybeLossDistanceOutput = {
  readonly distanceLostNm: number;
};

const DEFAULT_BOAT_LENGTHS_LOST_PER_GYBE = 4;

export const gybeLossDistanceExample = {
  input: { gybeCount: 4, boatLengthMeters: 45 },
  output: { distanceLostNm: 0.38876889848812096 },
} satisfies ToolExample<GybeLossDistanceInput, GybeLossDistanceOutput>;

export const calculateGybeLossDistance = (
  input: GybeLossDistanceInput,
): GybeLossDistanceOutput => {
  if (!(input.boatLengthMeters > 0))
    simpleError(
      "boatLengthMeters",
      "Boat length must be positive.",
      "invalid_length",
    );
  return {
    distanceLostNm:
      (input.gybeCount *
        input.boatLengthMeters *
        (input.boatLengthsLostPerGybe ?? DEFAULT_BOAT_LENGTHS_LOST_PER_GYBE)) /
      1852,
  };
};

export const gybeLossDistanceTool = createSimpleTool({
  id: "sailing/gybe-loss-distance",
  title: "Gybe Loss Distance",
  description:
    "Estimate the distance lost to gybing from the number of gybes, boat length, and boat lengths lost per gybe.",
  inputs: [
    {
      description: "Number of gybes performed.",
      id: "gybeCount",
      kind: "integer",
      label: "Gybe count",
      minimum: 0,
    },
    {
      description: "Overall length of the boat.",
      id: "boatLengthMeters",
      kind: "number",
      label: "Boat length",
      unit: "m",
    },
    {
      default: DEFAULT_BOAT_LENGTHS_LOST_PER_GYBE,
      description: "Boat lengths lost for each gybe.",
      id: "boatLengthsLostPerGybe",
      kind: "number",
      label: "Boat lengths lost per gybe",
      maximum: 10,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Total distance lost to gybing.",
      format: "length-nm",
      id: "distanceLostNm",
      kind: "number",
      label: "Distance lost",
      unit: "nm",
    },
  ],
  calculate: (input) =>
    calculateGybeLossDistance(input as unknown as GybeLossDistanceInput),
});

export const runGybeLossDistance = gybeLossDistanceTool.execute;
export default gybeLossDistanceTool;
