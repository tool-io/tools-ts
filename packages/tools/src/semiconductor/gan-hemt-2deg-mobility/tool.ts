import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GanHemt2degMobilityInput = {
  readonly sheetDensityPerCm2: number;
  readonly sheetResistanceOhmsPerSquare: number;
};

export type GanHemt2degMobilityOutput = {
  readonly mobilityCm2PerVoltSecond: number;
};

const ELEMENTARY_CHARGE_C = 1.602176634e-19;

export const ganHemt2degMobilityExample = {
  input: { sheetDensityPerCm2: 1e13, sheetResistanceOhmsPerSquare: 500 },
  output: { mobilityCm2PerVoltSecond: 1248.3018148921526 },
} satisfies ToolExample<GanHemt2degMobilityInput, GanHemt2degMobilityOutput>;

export const ganHemt2degMobilityTool = createSimpleTool({
  id: "semiconductor/gan-hemt-2deg-mobility",
  title: "GaN HEMT 2DEG Mobility Calculator",
  description:
    "Calculate GaN HEMT two-dimensional electron-gas mobility from measured sheet density and sheet resistance.",
  inputs: [
    {
      description: "Measured two-dimensional electron-gas sheet density.",
      id: "sheetDensityPerCm2",
      kind: "number",
      label: "2DEG sheet density",
      minimum: Number.MIN_VALUE,
      unit: "cm^-2",
    },
    {
      description: "Measured sheet resistance of the conducting channel.",
      id: "sheetResistanceOhmsPerSquare",
      kind: "number",
      label: "Sheet resistance",
      minimum: Number.MIN_VALUE,
      unit: "ohm/square",
    },
  ],
  outputs: [
    {
      description: "Carrier mobility calculated as 1/(q ns Rs).",
      id: "mobilityCm2PerVoltSecond",
      kind: "number",
      label: "2DEG mobility",
      minimum: Number.MIN_VALUE,
      unit: "cm^2/(V*s)",
    },
  ],
  calculate: (input) => {
    const sheetDensityPerCm2 = input.sheetDensityPerCm2 as number;
    const sheetResistanceOhmsPerSquare =
      input.sheetResistanceOhmsPerSquare as number;
    const mobilityCm2PerVoltSecond =
      1 /
      (ELEMENTARY_CHARGE_C * sheetDensityPerCm2 * sheetResistanceOhmsPerSquare);
    if (
      !Number.isFinite(mobilityCm2PerVoltSecond) ||
      mobilityCm2PerVoltSecond <= 0
    )
      simpleError(
        "sheetDensityPerCm2",
        "The mobility is not representable.",
        "numeric_range",
      );
    return { mobilityCm2PerVoltSecond };
  },
});
export const runGanHemt2degMobility = ganHemt2degMobilityTool.execute;
export default ganHemt2degMobilityTool;
