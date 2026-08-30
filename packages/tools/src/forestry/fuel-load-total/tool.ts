import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FuelLoadTotalInput = Readonly<{
  readonly liveKgPerSquareMeter: number;
  readonly deadKgPerSquareMeter: number;
}>;
export type FuelLoadTotalOutput = Readonly<{
  readonly totalKgPerSquareMeter: number;
}>;

export const calculateFuelLoadTotal = (
  x: FuelLoadTotalInput,
): FuelLoadTotalOutput => {
  if (!Number.isFinite(x.liveKgPerSquareMeter) || x.liveKgPerSquareMeter < 0)
    simpleError("liveKgPerSquareMeter", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.deadKgPerSquareMeter) || x.deadKgPerSquareMeter < 0)
    simpleError("deadKgPerSquareMeter", "Provide a finite nonnegative number.");
  const totalKgPerSquareMeter = x.liveKgPerSquareMeter + x.deadKgPerSquareMeter;
  if (!Number.isFinite(totalKgPerSquareMeter))
    simpleError(
      "totalKgPerSquareMeter",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    totalKgPerSquareMeter: Object.is(totalKgPerSquareMeter, -0)
      ? 0
      : totalKgPerSquareMeter,
  };
};

export const example = {
  input: {
    liveKgPerSquareMeter: 1,
    deadKgPerSquareMeter: 2,
  },
  output: { totalKgPerSquareMeter: 3 },
} satisfies ToolExample<FuelLoadTotalInput, FuelLoadTotalOutput>;

export const tool = createSimpleTool({
  id: "forestry/fuel-load-total",
  title: "Fuel Load Total",
  description:
    "Total areal fuel load from measured live and dead dry-mass loads in kg/m².",
  inputs: [
    {
      id: "liveKgPerSquareMeter",
      kind: "number",
      label: "Live Kg Per Square Meter",
      unit: "kg/m2",
      minimum: 0,
    },
    {
      id: "deadKgPerSquareMeter",
      kind: "number",
      label: "Dead Kg Per Square Meter",
      unit: "kg/m2",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "totalKgPerSquareMeter",
      kind: "number",
      label: "Total Kg Per Square Meter",
      unit: "kg/m2",
    },
  ],
  calculate: (input) =>
    calculateFuelLoadTotal({
      liveKgPerSquareMeter: input.liveKgPerSquareMeter as number,
      deadKgPerSquareMeter: input.deadKgPerSquareMeter as number,
    }),
});
export const fuelLoadTotalTool = tool;
export const runFuelLoadTotal = tool.execute;
export default tool;
