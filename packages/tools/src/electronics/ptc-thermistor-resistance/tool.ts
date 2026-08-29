import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PtcThermistorResistanceInput = Readonly<{
  readonly referenceResistanceOhms: number;
  readonly temperatureCoefficientPerCelsius: number;
  readonly temperatureCelsius: number;
  readonly referenceTemperatureCelsius: number;
}>;
export type PtcThermistorResistanceOutput = Readonly<{
  resistanceOhms: number;
}>;

export const calculatePtcThermistorResistance = (
  i: PtcThermistorResistanceInput,
): PtcThermistorResistanceOutput => {
  if (
    1 +
      i.temperatureCoefficientPerCelsius *
        (i.temperatureCelsius - i.referenceTemperatureCelsius) <
    0
  )
    simpleError(
      "temperatureCelsius",
      "The linear model predicts a negative resistance.",
    );
  const value =
    i.referenceResistanceOhms *
    (1 +
      i.temperatureCoefficientPerCelsius *
        (i.temperatureCelsius - i.referenceTemperatureCelsius));
  if (!Number.isFinite(value))
    simpleError("resistanceOhms", "The inputs produce a non-finite result.");
  return { resistanceOhms: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: {
    referenceResistanceOhms: 1000,
    temperatureCoefficientPerCelsius: 0.004,
    temperatureCelsius: 50,
    referenceTemperatureCelsius: 25,
  },
  output: { resistanceOhms: 1100 },
} satisfies ToolExample<
  PtcThermistorResistanceInput,
  PtcThermistorResistanceOutput
>;

export const tool = createSimpleTool({
  id: "electronics/ptc-thermistor-resistance",
  title: "PTC Thermistor Resistance",
  description:
    "Estimate PTC thermistor resistance near a reference temperature using the supplied linear temperature coefficient; real PTC curves can be strongly nonlinear.",
  inputs: [
    {
      id: "referenceResistanceOhms",
      kind: "number",
      label: "Reference Resistance (Ω)",
      unit: "Ω",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "temperatureCoefficientPerCelsius",
      kind: "number",
      label: "Temperature coefficient (1/°C)",
      unit: "1/°C",
    },
    {
      id: "temperatureCelsius",
      kind: "number",
      label: "Temperature (°C)",
      unit: "°C",
    },
    {
      id: "referenceTemperatureCelsius",
      kind: "number",
      label: "Reference Temperature (°C)",
      unit: "°C",
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
    calculatePtcThermistorResistance({
      referenceResistanceOhms: input.referenceResistanceOhms as number,
      temperatureCoefficientPerCelsius:
        input.temperatureCoefficientPerCelsius as number,
      temperatureCelsius: input.temperatureCelsius as number,
      referenceTemperatureCelsius: input.referenceTemperatureCelsius as number,
    }),
});
export const ptcThermistorResistanceTool = tool;
export const runPtcThermistorResistance = tool.execute;
export default tool;
