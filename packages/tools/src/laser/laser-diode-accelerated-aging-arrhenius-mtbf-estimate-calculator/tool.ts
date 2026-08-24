import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ArrheniusMtbfInput = {
  readonly mtbfHoursStress: number;
  readonly eaEv: number;
  readonly tUseC: number;
  readonly tStressC: number;
};

export type ArrheniusMtbfOutput = {
  readonly accelerationFactor: number;
  readonly mtbfHoursAtUseTemperature: number;
};

/** Boltzmann constant in electronvolts per kelvin. */
export const BOLTZMANN_EV_PER_K = 8.617333262e-5;

/**
 * Arrhenius acceleration between a stress and a use junction temperature:
 * AF = exp[(Ea / k) * (1/T_use - 1/T_stress)].
 */
export const arrheniusAccelerationFactor = (
  eaEv: number,
  tUseC: number,
  tStressC: number,
): number => {
  const tUseK = tUseC + 273.15;
  const tStressK = tStressC + 273.15;
  if (tUseK <= 0 || tStressK <= 0)
    simpleError("tUseC", "Temperatures must be above absolute zero.");
  if (tUseC >= tStressC)
    simpleError(
      "tUseC",
      "Use temperature should be below the stress temperature for an acceleration factor.",
    );
  return Math.exp((eaEv / BOLTZMANN_EV_PER_K) * (1 / tUseK - 1 / tStressK));
};

export const estimateMtbfAtUseTemperature = (
  input: ArrheniusMtbfInput,
): ArrheniusMtbfOutput => {
  if (input.mtbfHoursStress <= 0)
    simpleError("mtbfHoursStress", "Stress MTBF must be positive.");
  if (input.eaEv <= 0)
    simpleError("eaEv", "Activation energy must be positive.");
  const accelerationFactor = arrheniusAccelerationFactor(
    input.eaEv,
    input.tUseC,
    input.tStressC,
  );
  const mtbfHoursAtUseTemperature = input.mtbfHoursStress * accelerationFactor;
  if (![accelerationFactor, mtbfHoursAtUseTemperature].every(Number.isFinite))
    simpleError("eaEv", "The Arrhenius projection exceeds the numeric range.");
  return {
    accelerationFactor,
    mtbfHoursAtUseTemperature,
  };
};

export const arrheniusMtbfExample = {
  input: { mtbfHoursStress: 100000, eaEv: 0.45, tUseC: 45, tStressC: 85 },
  output: {
    accelerationFactor: Math.exp(
      (0.45 / 8.617333262e-5) * (1 / 318.15 - 1 / 358.15),
    ),
    mtbfHoursAtUseTemperature:
      100000 * Math.exp((0.45 / 8.617333262e-5) * (1 / 318.15 - 1 / 358.15)),
  },
} satisfies ToolExample<ArrheniusMtbfInput, ArrheniusMtbfOutput>;

export const arrheniusMtbfTool = createSimpleTool({
  calculate: (input) =>
    estimateMtbfAtUseTemperature({
      eaEv: input.eaEv as number,
      mtbfHoursStress: input.mtbfHoursStress as number,
      tStressC: input.tStressC as number,
      tUseC: input.tUseC as number,
    }),
  description:
    "Project a laser-diode lifetime from an accelerated-temperature test back to the use junction temperature with the Arrhenius model.",
  id: "laser/laser-diode-accelerated-aging-arrhenius-mtbf-estimate-calculator",
  inputs: [
    {
      description: "Mean time between failures at the stress condition.",
      id: "mtbfHoursStress",
      kind: "number",
      label: "MTBF at stress",
      minimum: 0,
      unit: "h",
    },
    {
      description: "Activation energy of the dominant wear-out mechanism.",
      id: "eaEv",
      kind: "number",
      label: "Ea",
      minimum: 0,
      unit: "eV",
    },
    {
      description: "Junction temperature in the field application.",
      id: "tUseC",
      kind: "number",
      label: "T_use",
      unit: "°C",
    },
    {
      description: "Junction temperature of the accelerated test.",
      id: "tStressC",
      kind: "number",
      label: "T_stress",
      unit: "°C",
    },
  ],
  outputs: [
    {
      description: "Acceleration factor between stress and use temperatures.",
      id: "accelerationFactor",
      kind: "number",
      label: "AF",
    },
    {
      description: "Projected lifetime at the use temperature.",
      id: "mtbfHoursAtUseTemperature",
      kind: "number",
      label: "MTBF at use",
      unit: "h",
    },
  ],
  title: "Diode Arrhenius Lifetime Estimate",
});
export const runArrheniusMtbf = arrheniusMtbfTool.execute;
export default arrheniusMtbfTool;

export { arrheniusMtbfExample as example };
