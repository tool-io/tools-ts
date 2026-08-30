import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ParkingIncomeInput = Readonly<{
  readonly occupiedSpaces: number;
  readonly monthlyRentPerSpace: number;
}>;
export type ParkingIncomeOutput = Readonly<{
  readonly monthlyIncome: number;
}>;

export const calculateParkingIncome = (
  x: ParkingIncomeInput,
): ParkingIncomeOutput => {
  if (!Number.isFinite(x.occupiedSpaces) || x.occupiedSpaces < 0)
    simpleError("occupiedSpaces", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.monthlyRentPerSpace) || x.monthlyRentPerSpace < 0)
    simpleError("monthlyRentPerSpace", "Provide a finite nonnegative number.");
  if (!Number.isInteger(x.occupiedSpaces))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const monthlyIncome = x.occupiedSpaces * x.monthlyRentPerSpace;
  if (!Number.isFinite(monthlyIncome))
    simpleError(
      "monthlyIncome",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { monthlyIncome: Object.is(monthlyIncome, -0) ? 0 : monthlyIncome };
};

export const example = {
  input: {
    occupiedSpaces: 20,
    monthlyRentPerSpace: 100,
  },
  output: { monthlyIncome: 2000 },
} satisfies ToolExample<ParkingIncomeInput, ParkingIncomeOutput>;

export const tool = createSimpleTool({
  id: "real-estate/parking-income",
  title: "Parking Income",
  description:
    "Monthly parking revenue from occupied spaces and monthly rent per space.",
  inputs: [
    {
      id: "occupiedSpaces",
      kind: "number",
      label: "Occupied Spaces",
      minimum: 0,
    },
    {
      id: "monthlyRentPerSpace",
      kind: "number",
      label: "Monthly Rent Per Space",
      unit: "currency",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "monthlyIncome",
      kind: "number",
      label: "Monthly Income",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculateParkingIncome({
      occupiedSpaces: input.occupiedSpaces as number,
      monthlyRentPerSpace: input.monthlyRentPerSpace as number,
    }),
});
export const parkingIncomeTool = tool;
export const runParkingIncome = tool.execute;
export default tool;
