import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LaserCuttingPowerInput = Readonly<{
  readonly energyJoulesPerMillimeter: number;
  readonly cutSpeedMillimetersPerSecond: number;
}>;
export type LaserCuttingPowerOutput = Readonly<{
  readonly absorbedPowerWatts: number;
}>;

export const calculateLaserCuttingPower = (
  x: LaserCuttingPowerInput,
): LaserCuttingPowerOutput => {
  if (
    !Number.isFinite(x.energyJoulesPerMillimeter) ||
    x.energyJoulesPerMillimeter < 0
  )
    simpleError(
      "energyJoulesPerMillimeter",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.cutSpeedMillimetersPerSecond) ||
    x.cutSpeedMillimetersPerSecond < 0
  )
    simpleError(
      "cutSpeedMillimetersPerSecond",
      "Provide a finite number at least 0.",
    );
  const absorbedPowerWatts =
    x.energyJoulesPerMillimeter * x.cutSpeedMillimetersPerSecond;
  if (!Number.isFinite(absorbedPowerWatts))
    simpleError(
      "absorbedPowerWatts",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    absorbedPowerWatts: Object.is(absorbedPowerWatts, -0)
      ? 0
      : absorbedPowerWatts,
  };
};

export const example = {
  input: { energyJoulesPerMillimeter: 10, cutSpeedMillimetersPerSecond: 20 },
  output: { absorbedPowerWatts: 200 },
} satisfies ToolExample<LaserCuttingPowerInput, LaserCuttingPowerOutput>;

export const tool = createSimpleTool({
  id: "engineering/laser-cutting-power",
  title: "Laser Cutting Power",
  description:
    "Ideal absorbed laser power from required energy per cut length and cutting speed; laser efficiency is not included.",
  inputs: [
    {
      id: "energyJoulesPerMillimeter",
      kind: "number",
      label: "Energy Joules Per Millimeter",
      unit: "J/mm",
      minimum: 0,
    },
    {
      id: "cutSpeedMillimetersPerSecond",
      kind: "number",
      label: "Cut Speed Millimeters Per Second",
      unit: "mm/s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "absorbedPowerWatts",
      kind: "number",
      label: "Absorbed Power Watts",
      unit: "W",
    },
  ],
  calculate: (input) =>
    calculateLaserCuttingPower({
      energyJoulesPerMillimeter: input.energyJoulesPerMillimeter as number,
      cutSpeedMillimetersPerSecond:
        input.cutSpeedMillimetersPerSecond as number,
    }),
});
export const laserCuttingPowerTool = tool;
export const runLaserCuttingPower = tool.execute;
export default tool;
