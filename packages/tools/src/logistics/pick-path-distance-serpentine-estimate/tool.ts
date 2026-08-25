import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PickPathDistanceSerpentineEstimateInput = {
  readonly aislesTraversed: number;
  readonly aisleLengthM: number;
  readonly aisleCenterSpacingM: number;
};

export type PickPathDistanceSerpentineEstimateOutput = {
  readonly verticalTravelM: number;
  readonly horizontalTravelM: number;
  readonly totalPickPathM: number;
};

export const calculatePickPathDistanceSerpentineEstimate = (
  input: PickPathDistanceSerpentineEstimateInput,
): PickPathDistanceSerpentineEstimateOutput => {
  if (!(
    Number.isSafeInteger(input.aislesTraversed) && input.aislesTraversed >= 1
  ))
    return simpleError(
      "aislesTraversed",
      "The aisle count must be a whole number of at least one.",
      "invalid_aisles",
    );
  for (const key of ["aisleLengthM", "aisleCenterSpacingM"] as const) {
    if (!Number.isFinite(input[key]) || input[key] <= 0)
      return simpleError(
        key,
        "Aisle dimensions must be greater than zero.",
        "invalid_dimension",
      );
  }
  const verticalTravelM = input.aislesTraversed * input.aisleLengthM;
  const horizontalTravelM =
    (input.aislesTraversed - 1) * input.aisleCenterSpacingM;
  const totalPickPathM = verticalTravelM + horizontalTravelM;
  if (
    !Number.isFinite(verticalTravelM) ||
    !Number.isFinite(horizontalTravelM) ||
    !Number.isFinite(totalPickPathM)
  )
    return simpleError(
      "aislesTraversed",
      "The estimated path is outside the representable range.",
      "distance_out_of_range",
    );
  return {
    verticalTravelM,
    horizontalTravelM,
    totalPickPathM,
  };
};

export const pickPathDistanceSerpentineEstimateExample = {
  input: { aislesTraversed: 8, aisleLengthM: 42, aisleCenterSpacingM: 3.4 },
  output: {
    verticalTravelM: 336,
    horizontalTravelM: 23.8,
    totalPickPathM: 359.8,
  },
} satisfies ToolExample<
  PickPathDistanceSerpentineEstimateInput,
  PickPathDistanceSerpentineEstimateOutput
>;

export const pickPathDistanceSerpentineEstimateTool = createSimpleTool({
  id: "logistics/pick-path-distance-serpentine-estimate",
  title: "Pick Path Distance Serpentine Estimate",
  description:
    "Estimate serpentine pick-path length as full traversals of each entered aisle plus cross-aisle hops between neighbouring aisle centers.",
  inputs: [
    {
      description: "Number of aisles the route enters.",
      id: "aislesTraversed",
      kind: "integer",
      label: "Aisles",
      minimum: 1,
    },
    {
      description: "Usable picking length of each aisle in metres.",
      id: "aisleLengthM",
      kind: "number",
      label: "Aisle length",
      minimum: Number.MIN_VALUE,
      unit: "m",
    },
    {
      description:
        "Centre-to-centre spacing between adjacent aisles in metres.",
      id: "aisleCenterSpacingM",
      kind: "number",
      label: "Aisle pitch",
      minimum: Number.MIN_VALUE,
      unit: "m",
    },
  ],
  outputs: [
    {
      description: "Distance walked inside aisles in metres.",
      id: "verticalTravelM",
      kind: "number",
      label: "In-aisle",
    },
    {
      description: "Distance walked across aisles in metres.",
      id: "horizontalTravelM",
      kind: "number",
      label: "Cross-aisle",
    },
    {
      description: "Total estimated pick path in metres.",
      id: "totalPickPathM",
      kind: "number",
      label: "Total path",
    },
  ],
  calculate: (input) =>
    calculatePickPathDistanceSerpentineEstimate({
      aisleCenterSpacingM: input.aisleCenterSpacingM as number,
      aisleLengthM: input.aisleLengthM as number,
      aislesTraversed: input.aislesTraversed as number,
    }),
});

export const runPickPathDistanceSerpentineEstimate =
  pickPathDistanceSerpentineEstimateTool.execute;
export default pickPathDistanceSerpentineEstimateTool;
