import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NtcThermistorBetaResistanceInput = Readonly<{
  readonly referenceResistanceOhms: number;
  readonly betaKelvin: number;
  readonly temperatureKelvin: number;
  readonly referenceTemperatureKelvin: number;
}>;
export type NtcThermistorBetaResistanceOutput = Readonly<{
  resistanceOhms: number;
}>;

export const calculateNtcThermistorBetaResistance = (
  i: NtcThermistorBetaResistanceInput,
): NtcThermistorBetaResistanceOutput => {
  const value =
    i.referenceResistanceOhms *
    Math.exp(
      i.betaKelvin *
        (1 / i.temperatureKelvin - 1 / i.referenceTemperatureKelvin),
    );
  if (!Number.isFinite(value))
    simpleError("resistanceOhms", "The inputs produce a non-finite result.");
  return { resistanceOhms: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: {
    referenceResistanceOhms: 10000,
    betaKelvin: 3950,
    temperatureKelvin: 308.15,
    referenceTemperatureKelvin: 298.15,
  },
  output: { resistanceOhms: 6505.531126156567 },
} satisfies ToolExample<
  NtcThermistorBetaResistanceInput,
  NtcThermistorBetaResistanceOutput
>;

export const tool = createSimpleTool({
  id: "electronics/ntc-thermistor-beta-resistance",
  title: "NTC Thermistor Beta Resistance",
  description:
    "Estimate NTC thermistor resistance with the beta-parameter approximation R=R0 exp[B(1/T−1/T0)] using absolute kelvin temperatures; this is not the full Steinhart–Hart equation.",
  inputs: [
    {
      id: "referenceResistanceOhms",
      kind: "number",
      label: "Reference Resistance (Ω)",
      unit: "Ω",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "betaKelvin",
      kind: "number",
      label: "Beta (K)",
      unit: "K",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "temperatureKelvin",
      kind: "number",
      label: "Temperature (K)",
      unit: "K",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "referenceTemperatureKelvin",
      kind: "number",
      label: "Reference Temperature (K)",
      unit: "K",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "resistanceOhms",
      kind: "number",
      label: "Resistance (Ω)",
      unit: "Ω",
    },
  ],
  calculate: (input) =>
    calculateNtcThermistorBetaResistance({
      referenceResistanceOhms: input.referenceResistanceOhms as number,
      betaKelvin: input.betaKelvin as number,
      temperatureKelvin: input.temperatureKelvin as number,
      referenceTemperatureKelvin: input.referenceTemperatureKelvin as number,
    }),
});
export const ntcThermistorBetaResistanceTool = tool;
export const runNtcThermistorBetaResistance = tool.execute;
export default tool;
