import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PowerFactorCorrectionCapacitorInput = Readonly<{
  readonly realPowerWatts: number;
  readonly voltageVolts: number;
  readonly frequencyHertz: number;
  readonly initialPowerFactor: number;
  readonly targetPowerFactor: number;
}>;
export type PowerFactorCorrectionCapacitorOutput = Readonly<{
  readonly capacitanceFarads: number;
}>;

export const calculatePowerFactorCorrectionCapacitor = (
  x: PowerFactorCorrectionCapacitorInput,
): PowerFactorCorrectionCapacitorOutput => {
  if (!Number.isFinite(x.realPowerWatts) || x.realPowerWatts < 0)
    simpleError("realPowerWatts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.voltageVolts) || x.voltageVolts < 0)
    simpleError("voltageVolts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.frequencyHertz) || x.frequencyHertz < 0)
    simpleError("frequencyHertz", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.initialPowerFactor) || x.initialPowerFactor < 0)
    simpleError("initialPowerFactor", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.targetPowerFactor) || x.targetPowerFactor < 0)
    simpleError("targetPowerFactor", "Provide a finite number at least 0.");
  if (
    x.initialPowerFactor <= 0 ||
    x.initialPowerFactor > 1 ||
    x.targetPowerFactor <= x.initialPowerFactor ||
    x.targetPowerFactor > 1
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const capacitanceFarads =
    (x.realPowerWatts *
      (Math.tan(Math.acos(x.initialPowerFactor)) -
        Math.tan(Math.acos(x.targetPowerFactor)))) /
    (2 * Math.PI * x.frequencyHertz * x.voltageVolts ** 2);
  if (!Number.isFinite(capacitanceFarads))
    simpleError(
      "capacitanceFarads",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    capacitanceFarads: Object.is(capacitanceFarads, -0) ? 0 : capacitanceFarads,
  };
};

export const example = {
  input: {
    realPowerWatts: 1000,
    voltageVolts: 230,
    frequencyHertz: 50,
    initialPowerFactor: 0.7,
    targetPowerFactor: 0.95,
  },
  output: { capacitanceFarads: 0.00004161013960328995 },
} satisfies ToolExample<
  PowerFactorCorrectionCapacitorInput,
  PowerFactorCorrectionCapacitorOutput
>;

export const tool = createSimpleTool({
  id: "engineering/power-factor-correction-capacitor",
  title: "Power Factor Correction Capacitor",
  description:
    "Ideal single-phase shunt capacitance needed to raise lagging power factor at fixed real power, RMS voltage and frequency.",
  inputs: [
    {
      id: "realPowerWatts",
      kind: "number",
      label: "Real Power Watts",
      unit: "W",
      minimum: 0,
    },
    {
      id: "voltageVolts",
      kind: "number",
      label: "Voltage Volts",
      unit: "V",
      minimum: 0,
    },
    {
      id: "frequencyHertz",
      kind: "number",
      label: "Frequency Hertz",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "initialPowerFactor",
      kind: "number",
      label: "Initial Power Factor",
      minimum: 0,
    },
    {
      id: "targetPowerFactor",
      kind: "number",
      label: "Target Power Factor",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "capacitanceFarads",
      kind: "number",
      label: "Capacitance Farads",
      unit: "F",
    },
  ],
  calculate: (input) =>
    calculatePowerFactorCorrectionCapacitor({
      realPowerWatts: input.realPowerWatts as number,
      voltageVolts: input.voltageVolts as number,
      frequencyHertz: input.frequencyHertz as number,
      initialPowerFactor: input.initialPowerFactor as number,
      targetPowerFactor: input.targetPowerFactor as number,
    }),
});
export const powerFactorCorrectionCapacitorTool = tool;
export const runPowerFactorCorrectionCapacitor = tool.execute;
export default tool;
