import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OccupancyRateInput = Readonly<{
  readonly occupiedUnits: number;
  readonly totalUnits: number;
}>;
export type OccupancyRateOutput = Readonly<{
  readonly occupancyPercent: number;
}>;

export const calculateOccupancyRate = (
  x: OccupancyRateInput,
): OccupancyRateOutput => {
  if (!Number.isFinite(x.occupiedUnits) || x.occupiedUnits < 0)
    simpleError("occupiedUnits", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.totalUnits) ||
    !Number.isSafeInteger(x.totalUnits) ||
    x.totalUnits < 1
  )
    simpleError("totalUnits", "Provide a positive safe integer.");
  if (!(Number.isInteger(x.occupiedUnits) && x.occupiedUnits <= x.totalUnits))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const occupancyPercent = (100 * x.occupiedUnits) / x.totalUnits;
  if (!Number.isFinite(occupancyPercent))
    simpleError(
      "occupancyPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    occupancyPercent: Object.is(occupancyPercent, -0) ? 0 : occupancyPercent,
  };
};

export const example = {
  input: {
    occupiedUnits: 90,
    totalUnits: 100,
  },
  output: { occupancyPercent: 90 },
} satisfies ToolExample<OccupancyRateInput, OccupancyRateOutput>;

export const tool = createSimpleTool({
  id: "real-estate/occupancy-rate",
  title: "Occupancy Rate",
  description:
    "Occupied units as a percentage of rentable units at one snapshot date.",
  inputs: [
    {
      id: "occupiedUnits",
      kind: "number",
      label: "Occupied Units",
      minimum: 0,
    },
    { id: "totalUnits", kind: "integer", label: "Total Units", minimum: 1 },
  ],
  outputs: [
    {
      id: "occupancyPercent",
      kind: "number",
      label: "Occupancy Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateOccupancyRate({
      occupiedUnits: input.occupiedUnits as number,
      totalUnits: input.totalUnits as number,
    }),
});
export const occupancyRateTool = tool;
export const runOccupancyRate = tool.execute;
export default tool;
