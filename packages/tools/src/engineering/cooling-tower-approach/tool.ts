import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CoolingTowerApproachInput = Readonly<{
  readonly outletCelsius: number;
  readonly wetBulbCelsius: number;
}>;
export type CoolingTowerApproachOutput = Readonly<{
  readonly approachKelvin: number;
}>;

export const calculateCoolingTowerApproach = (
  x: CoolingTowerApproachInput,
): CoolingTowerApproachOutput => {
  if (!Number.isFinite(x.outletCelsius))
    simpleError("outletCelsius", "Provide a finite number.");
  if (!Number.isFinite(x.wetBulbCelsius))
    simpleError("wetBulbCelsius", "Provide a finite number.");
  if (x.outletCelsius < x.wetBulbCelsius)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const approachKelvin = x.outletCelsius - x.wetBulbCelsius;
  if (!Number.isFinite(approachKelvin))
    simpleError(
      "approachKelvin",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { approachKelvin: Object.is(approachKelvin, -0) ? 0 : approachKelvin };
};

export const example = {
  input: { outletCelsius: 25, wetBulbCelsius: 20 },
  output: { approachKelvin: 5 },
} satisfies ToolExample<CoolingTowerApproachInput, CoolingTowerApproachOutput>;

export const tool = createSimpleTool({
  id: "engineering/cooling-tower-approach",
  title: "Cooling Tower Approach",
  description:
    "Cooling-tower approach temperature as cooled-water outlet temperature minus ambient wet-bulb temperature.",
  inputs: [
    {
      id: "outletCelsius",
      kind: "number",
      label: "Outlet Celsius",
      unit: "°C",
    },
    {
      id: "wetBulbCelsius",
      kind: "number",
      label: "Wet Bulb Celsius",
      unit: "°C",
    },
  ],
  outputs: [
    {
      id: "approachKelvin",
      kind: "number",
      label: "Approach Kelvin",
      unit: "K",
    },
  ],
  calculate: (input) =>
    calculateCoolingTowerApproach({
      outletCelsius: input.outletCelsius as number,
      wetBulbCelsius: input.wetBulbCelsius as number,
    }),
});
export const coolingTowerApproachTool = tool;
export const runCoolingTowerApproach = tool.execute;
export default tool;
