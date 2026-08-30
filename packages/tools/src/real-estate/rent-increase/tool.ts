import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RentIncreaseInput = Readonly<{
  readonly oldMonthlyRent: number;
  readonly increasePercent: number;
}>;
export type RentIncreaseOutput = Readonly<{
  readonly newMonthlyRent: number;
}>;

export const calculateRentIncrease = (
  x: RentIncreaseInput,
): RentIncreaseOutput => {
  if (!Number.isFinite(x.oldMonthlyRent) || x.oldMonthlyRent < 0)
    simpleError("oldMonthlyRent", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.increasePercent))
    simpleError("increasePercent", "Provide a finite number.");
  if (!(x.increasePercent >= -100))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const newMonthlyRent = x.oldMonthlyRent * (1 + x.increasePercent / 100);
  if (!Number.isFinite(newMonthlyRent))
    simpleError(
      "newMonthlyRent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { newMonthlyRent: Object.is(newMonthlyRent, -0) ? 0 : newMonthlyRent };
};

export const example = {
  input: {
    oldMonthlyRent: 1000,
    increasePercent: 5,
  },
  output: { newMonthlyRent: 1050 },
} satisfies ToolExample<RentIncreaseInput, RentIncreaseOutput>;

export const tool = createSimpleTool({
  id: "real-estate/rent-increase",
  title: "Rent Increase",
  description:
    "New monthly rent after a specified percentage increase from old rent.",
  inputs: [
    {
      id: "oldMonthlyRent",
      kind: "number",
      label: "Old Monthly Rent",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "increasePercent",
      kind: "number",
      label: "Increase Percent",
      unit: "percent",
    },
  ],
  outputs: [
    {
      id: "newMonthlyRent",
      kind: "number",
      label: "New Monthly Rent",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculateRentIncrease({
      oldMonthlyRent: input.oldMonthlyRent as number,
      increasePercent: input.increasePercent as number,
    }),
});
export const rentIncreaseTool = tool;
export const runRentIncrease = tool.execute;
export default tool;
