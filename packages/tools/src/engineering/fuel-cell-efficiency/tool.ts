import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FuelCellEfficiencyInput = Readonly<{
  readonly electricKilowattHours: number;
  readonly fuelLhvKilowattHours: number;
}>;
export type FuelCellEfficiencyOutput = Readonly<{
  readonly efficiencyPercent: number;
}>;

export const calculateFuelCellEfficiency = (
  x: FuelCellEfficiencyInput,
): FuelCellEfficiencyOutput => {
  if (!Number.isFinite(x.electricKilowattHours) || x.electricKilowattHours < 0)
    simpleError("electricKilowattHours", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.fuelLhvKilowattHours) || x.fuelLhvKilowattHours < 0)
    simpleError("fuelLhvKilowattHours", "Provide a finite number at least 0.");
  if (x.electricKilowattHours > x.fuelLhvKilowattHours)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const efficiencyPercent =
    (100 * x.electricKilowattHours) / x.fuelLhvKilowattHours;
  if (!Number.isFinite(efficiencyPercent))
    simpleError(
      "efficiencyPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    efficiencyPercent: Object.is(efficiencyPercent, -0) ? 0 : efficiencyPercent,
  };
};

export const example = {
  input: { electricKilowattHours: 5, fuelLhvKilowattHours: 10 },
  output: { efficiencyPercent: 50 },
} satisfies ToolExample<FuelCellEfficiencyInput, FuelCellEfficiencyOutput>;

export const tool = createSimpleTool({
  id: "engineering/fuel-cell-efficiency",
  title: "Fuel Cell Efficiency",
  description:
    "Fuel-cell electrical efficiency from electric output energy divided by fuel lower-heating-value input energy.",
  inputs: [
    {
      id: "electricKilowattHours",
      kind: "number",
      label: "Electric Kilowatt Hours",
      unit: "kWh",
      minimum: 0,
    },
    {
      id: "fuelLhvKilowattHours",
      kind: "number",
      label: "Fuel Lhv Kilowatt Hours",
      unit: "kWh",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "efficiencyPercent",
      kind: "number",
      label: "Efficiency Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateFuelCellEfficiency({
      electricKilowattHours: input.electricKilowattHours as number,
      fuelLhvKilowattHours: input.fuelLhvKilowattHours as number,
    }),
});
export const fuelCellEfficiencyTool = tool;
export const runFuelCellEfficiency = tool.execute;
export default tool;
