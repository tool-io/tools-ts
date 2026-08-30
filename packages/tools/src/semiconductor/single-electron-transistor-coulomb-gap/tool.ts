import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SingleElectronTransistorCoulombGapInput = Readonly<{
  readonly totalCapacitanceFarads: number;
}>;
export type SingleElectronTransistorCoulombGapOutput = Readonly<{
  readonly chargingVolts: number;
}>;

export const calculateSingleElectronTransistorCoulombGap = (
  x: SingleElectronTransistorCoulombGapInput,
): SingleElectronTransistorCoulombGapOutput => {
  if (
    !Number.isFinite(x.totalCapacitanceFarads) ||
    x.totalCapacitanceFarads < 0
  )
    simpleError(
      "totalCapacitanceFarads",
      "Provide a finite number at least 0.",
    );
  const chargingVolts = 1.602176634e-19 / x.totalCapacitanceFarads;
  if (!Number.isFinite(chargingVolts))
    simpleError(
      "chargingVolts",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { chargingVolts: Object.is(chargingVolts, -0) ? 0 : chargingVolts };
};

export const example = {
  input: { totalCapacitanceFarads: 1e-18 },
  output: { chargingVolts: 0.1602176634 },
} satisfies ToolExample<
  SingleElectronTransistorCoulombGapInput,
  SingleElectronTransistorCoulombGapOutput
>;

export const tool = createSimpleTool({
  id: "semiconductor/single-electron-transistor-coulomb-gap",
  title: "Single Electron Transistor Coulomb Gap",
  description:
    "Single-electron charging-voltage scale e/CΣ from total island capacitance; thermal broadening and offset charge are excluded.",
  inputs: [
    {
      id: "totalCapacitanceFarads",
      kind: "number",
      label: "Total Capacitance Farads",
      unit: "F",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "chargingVolts", kind: "number", label: "Charging Volts", unit: "V" },
  ],
  calculate: (input) =>
    calculateSingleElectronTransistorCoulombGap({
      totalCapacitanceFarads: input.totalCapacitanceFarads as number,
    }),
});
export const singleElectronTransistorCoulombGapTool = tool;
export const runSingleElectronTransistorCoulombGap = tool.execute;
export default tool;
