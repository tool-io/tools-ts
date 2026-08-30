import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StorageIncomeInput = Readonly<{
  readonly occupiedUnits: number;
  readonly monthlyRentPerUnit: number;
}>;
export type StorageIncomeOutput = Readonly<{
  readonly monthlyIncome: number;
}>;

export const calculateStorageIncome = (
  x: StorageIncomeInput,
): StorageIncomeOutput => {
  if (!Number.isFinite(x.occupiedUnits) || x.occupiedUnits < 0)
    simpleError("occupiedUnits", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.monthlyRentPerUnit) || x.monthlyRentPerUnit < 0)
    simpleError("monthlyRentPerUnit", "Provide a finite nonnegative number.");
  if (!Number.isInteger(x.occupiedUnits))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const monthlyIncome = x.occupiedUnits * x.monthlyRentPerUnit;
  if (!Number.isFinite(monthlyIncome))
    simpleError(
      "monthlyIncome",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { monthlyIncome: Object.is(monthlyIncome, -0) ? 0 : monthlyIncome };
};

export const example = {
  input: {
    occupiedUnits: 10,
    monthlyRentPerUnit: 50,
  },
  output: { monthlyIncome: 500 },
} satisfies ToolExample<StorageIncomeInput, StorageIncomeOutput>;

export const tool = createSimpleTool({
  id: "real-estate/storage-income",
  title: "Storage Income",
  description:
    "Monthly storage income from occupied storage units and monthly rent per unit.",
  inputs: [
    {
      id: "occupiedUnits",
      kind: "number",
      label: "Occupied Units",
      minimum: 0,
    },
    {
      id: "monthlyRentPerUnit",
      kind: "number",
      label: "Monthly Rent Per Unit",
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
    calculateStorageIncome({
      occupiedUnits: input.occupiedUnits as number,
      monthlyRentPerUnit: input.monthlyRentPerUnit as number,
    }),
});
export const storageIncomeTool = tool;
export const runStorageIncome = tool.execute;
export default tool;
