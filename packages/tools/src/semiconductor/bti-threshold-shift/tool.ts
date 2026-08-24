import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const BOLTZ_EV_PER_K = 8.617333262e-5;

export type BtiThresholdShiftInput = {
  readonly activationEnergyEv?: number;
  readonly prefactorMillivolts?: number;
  readonly stressTimeHours: number;
  readonly temperatureKelvin: number;
};

export type BtiThresholdShiftOutput = {
  readonly thresholdShiftMillivolts: number;
};

export const btiThresholdShiftExample = {
  input: { stressTimeHours: 1, temperatureKelvin: 398 },
  output: { thresholdShiftMillivolts: 3033.1983769847016 },
} satisfies ToolExample<BtiThresholdShiftInput, BtiThresholdShiftOutput>;

export const calculateBtiThresholdShift = (
  input: BtiThresholdShiftInput,
): BtiThresholdShiftOutput => {
  const stressTimeHours = input.stressTimeHours;
  const temperatureKelvin = input.temperatureKelvin;
  const activationEnergyEv = input.activationEnergyEv ?? 0.6;
  const prefactorMillivolts = input.prefactorMillivolts ?? 10;

  if (!Number.isFinite(stressTimeHours) || stressTimeHours < 0)
    simpleError(
      "stressTimeHours",
      "Stress time must be a finite number at least 0 h.",
      "invalid_stress_time",
    );
  if (
    !Number.isFinite(temperatureKelvin) ||
    temperatureKelvin < 250 ||
    temperatureKelvin > 450
  )
    simpleError(
      "temperatureKelvin",
      "Temperature must be a finite number between 250 K and 450 K.",
      "invalid_temperature",
    );
  if (!Number.isFinite(activationEnergyEv) || activationEnergyEv < 0)
    simpleError(
      "activationEnergyEv",
      "Activation energy must be a finite number at least 0 eV.",
      "invalid_activation_energy",
    );
  if (!Number.isFinite(prefactorMillivolts) || prefactorMillivolts < 0)
    simpleError(
      "prefactorMillivolts",
      "Prefactor must be a finite number at least 0 mV.",
      "invalid_prefactor",
    );

  // Power law: t^{0.25}, handle 0 -> 0
  const timeFactor =
    stressTimeHours === 0 ? 0 : Math.pow(stressTimeHours, 0.25);
  if (!Number.isFinite(timeFactor))
    simpleError(
      "stressTimeHours",
      "Stress time factor overflowed.",
      "numeric_overflow",
    );

  const exponent =
    (activationEnergyEv / BOLTZ_EV_PER_K) * (1 / 300 - 1 / temperatureKelvin);
  if (!Number.isFinite(exponent))
    simpleError(
      "temperatureKelvin",
      "Arrhenius exponent overflowed.",
      "numeric_overflow",
    );

  const arrhenius = Math.exp(exponent);
  if (!Number.isFinite(arrhenius))
    simpleError(
      "temperatureKelvin",
      "Arrhenius factor overflowed.",
      "numeric_overflow",
    );

  const thresholdShiftMillivolts = prefactorMillivolts * timeFactor * arrhenius;
  if (!Number.isFinite(thresholdShiftMillivolts))
    simpleError(
      "stressTimeHours",
      "Threshold shift could not be calculated due to numeric overflow.",
      "numeric_overflow",
    );
  if (
    thresholdShiftMillivolts === 0 &&
    stressTimeHours > 0 &&
    prefactorMillivolts > 0
  )
    simpleError(
      "stressTimeHours",
      "Positive threshold shift is too small to represent.",
      "numeric_underflow",
    );

  return {
    thresholdShiftMillivolts:
      thresholdShiftMillivolts === 0 ? 0 : thresholdShiftMillivolts,
  };
};

export const btiThresholdShiftTool = createSimpleTool({
  calculate: (input) =>
    calculateBtiThresholdShift({
      activationEnergyEv:
        (input.activationEnergyEv as number | undefined) ?? undefined,
      prefactorMillivolts:
        (input.prefactorMillivolts as number | undefined) ?? undefined,
      stressTimeHours: input.stressTimeHours as number,
      temperatureKelvin: input.temperatureKelvin as number,
    }),
  description:
    "Estimate bias temperature instability threshold shift as prefactor·t^{0.25}·exp((Ea/kB)·(1/300-1/T)). t is stress time in hours, T is temperature in K, Ea activation energy in eV, prefactor in mV.",
  id: "semiconductor/bti-threshold-shift",
  inputs: [
    {
      description: "Stress time. Must be at least 0 h; 0 yields 0 mV.",
      id: "stressTimeHours",
      kind: "number",
      label: "Stress time",
      minimum: 0,
      unit: "h",
    },
    {
      description: "Stress temperature. Must be between 250 K and 450 K.",
      id: "temperatureKelvin",
      kind: "number",
      label: "Stress temperature",
      maximum: 450,
      minimum: 250,
      unit: "K",
    },
    {
      default: 0.6,
      description: "Activation energy. Must be at least 0 eV.",
      id: "activationEnergyEv",
      kind: "number",
      label: "Activation energy",
      minimum: 0,
      unit: "eV",
    },
    {
      default: 10,
      description: "Prefactor at 300 K and 1 h. Must be at least 0 mV.",
      id: "prefactorMillivolts",
      kind: "number",
      label: "Prefactor",
      minimum: 0,
      unit: "mV",
    },
  ],
  outputs: [
    {
      description: "Threshold voltage shift. Magnitude, positive.",
      id: "thresholdShiftMillivolts",
      kind: "number",
      label: "Threshold shift",
      minimum: 0,
      unit: "mV",
    },
  ],
  title: "BTI Threshold Shift Calculator",
});
export const runBtiThresholdShift = btiThresholdShiftTool.execute;
export default btiThresholdShiftTool;
