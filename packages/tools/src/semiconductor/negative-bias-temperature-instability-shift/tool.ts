import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NegativeBiasTemperatureInstabilityShiftInput = {
  readonly stressTimeHours: number;
  readonly temperatureKelvin: number;
  readonly prefactorMillivolts: number;
  readonly activationEnergyEv: number;
  readonly timeExponent: number;
};

export type NegativeBiasTemperatureInstabilityShiftOutput = {
  readonly thresholdShiftMillivolts: number;
};

const BOLTZMANN_EV_PER_K = 8.617333262e-5;

export const negativeBiasTemperatureInstabilityShiftExample = {
  input: {
    activationEnergyEv: 0.6,
    prefactorMillivolts: 10,
    stressTimeHours: 16,
    temperatureKelvin: 350,
    timeExponent: 0.25,
  },
  output: { thresholdShiftMillivolts: 550.7653628813396 },
} satisfies ToolExample<
  NegativeBiasTemperatureInstabilityShiftInput,
  NegativeBiasTemperatureInstabilityShiftOutput
>;

export const calculateNegativeBiasTemperatureInstabilityShift = (
  input: NegativeBiasTemperatureInstabilityShiftInput,
): NegativeBiasTemperatureInstabilityShiftOutput => {
  if (!Number.isFinite(input.stressTimeHours) || input.stressTimeHours < 0)
    simpleError("stressTimeHours", "Stress time must be nonnegative.");
  for (const [field, value] of [
    ["temperatureKelvin", input.temperatureKelvin],
    ["prefactorMillivolts", input.prefactorMillivolts],
    ["activationEnergyEv", input.activationEnergyEv],
    ["timeExponent", input.timeExponent],
  ] as const)
    if (!Number.isFinite(value) || value <= 0)
      simpleError(field, `${field} must be finite and positive.`);
  if (input.stressTimeHours === 0) return { thresholdShiftMillivolts: 0 };
  const logShift =
    Math.log(input.prefactorMillivolts) +
    input.timeExponent * Math.log(input.stressTimeHours) +
    (input.activationEnergyEv / BOLTZMANN_EV_PER_K) *
      (1 / 300 - 1 / input.temperatureKelvin);
  const thresholdShiftMillivolts = Math.exp(logShift);
  if (
    !Number.isFinite(thresholdShiftMillivolts) ||
    thresholdShiftMillivolts <= 0
  )
    simpleError(
      "stressTimeHours",
      "The threshold shift is outside the representable range.",
      "numeric_range",
    );
  return { thresholdShiftMillivolts };
};

export const negativeBiasTemperatureInstabilityShiftTool = createSimpleTool({
  id: "semiconductor/negative-bias-temperature-instability-shift",
  title: "NBTI Shift Calculator",
  description:
    "Estimate the negative bias temperature instability threshold voltage shift from stress time and junction temperature using an Arrhenius power law.",
  inputs: [
    {
      description: "Cumulative duration of negative gate bias stress.",
      id: "stressTimeHours",
      kind: "number",
      label: "Stress time",
      minimum: 0,
      unit: "h",
    },
    {
      description: "Device temperature during stress.",
      id: "temperatureKelvin",
      kind: "number",
      label: "Temperature",
      maximum: 450,
      minimum: 250,
      unit: "K",
    },
    {
      description: "Threshold shift prefactor at one hour of stress.",
      id: "prefactorMillivolts",
      kind: "number",
      label: "Prefactor",
      minimum: Number.MIN_VALUE,
      unit: "mV",
    },
    {
      description: "Activation energy governing the Arrhenius acceleration.",
      id: "activationEnergyEv",
      kind: "number",
      label: "Activation energy",
      minimum: Number.MIN_VALUE,
      unit: "eV",
    },
    {
      description: "Calibrated stress-time exponent applied to elapsed hours.",
      id: "timeExponent",
      kind: "number",
      label: "Time exponent",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      description: "Positive magnitude of the threshold voltage degradation.",
      id: "thresholdShiftMillivolts",
      kind: "number",
      label: "Threshold shift",
      minimum: 0,
      unit: "mV",
    },
  ],
  calculate: (input) =>
    calculateNegativeBiasTemperatureInstabilityShift({
      activationEnergyEv: input.activationEnergyEv as number,
      prefactorMillivolts: input.prefactorMillivolts as number,
      stressTimeHours: input.stressTimeHours as number,
      temperatureKelvin: input.temperatureKelvin as number,
      timeExponent: input.timeExponent as number,
    }),
});
export const runNegativeBiasTemperatureInstabilityShift =
  negativeBiasTemperatureInstabilityShiftTool.execute;
export default negativeBiasTemperatureInstabilityShiftTool;
