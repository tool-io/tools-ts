import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SchmittOscillatorFrequencyInput = Readonly<{
  readonly resistanceOhms: number;
  readonly capacitanceFarads: number;
  readonly thresholdFraction: number;
}>;
export type SchmittOscillatorFrequencyOutput = Readonly<{
  readonly frequencyHz: number;
}>;

export const calculateSchmittOscillatorFrequency = (
  x: SchmittOscillatorFrequencyInput,
): SchmittOscillatorFrequencyOutput => {
  if (!Number.isFinite(x.resistanceOhms) || x.resistanceOhms < 0)
    simpleError("resistanceOhms", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.capacitanceFarads) || x.capacitanceFarads < 0)
    simpleError("capacitanceFarads", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.thresholdFraction) || x.thresholdFraction < 0)
    simpleError("thresholdFraction", "Provide a finite number at least 0.");
  if (x.thresholdFraction >= 1)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const frequencyHz =
    1 /
    (2 *
      x.resistanceOhms *
      x.capacitanceFarads *
      Math.log((1 + x.thresholdFraction) / (1 - x.thresholdFraction)));
  if (!Number.isFinite(frequencyHz))
    simpleError(
      "frequencyHz",
      "Inputs produce an undefined or non-finite result.",
    );
  return { frequencyHz: Object.is(frequencyHz, -0) ? 0 : frequencyHz };
};

export const example = {
  input: {
    resistanceOhms: 1000,
    capacitanceFarads: 0.000001,
    thresholdFraction: 0.5,
  },
  output: { frequencyHz: 455.11961331341877 },
} satisfies ToolExample<
  SchmittOscillatorFrequencyInput,
  SchmittOscillatorFrequencyOutput
>;

export const tool = createSimpleTool({
  id: "electronics/schmitt-oscillator-frequency",
  title: "Schmitt Oscillator Frequency",
  description:
    "Frequency of a symmetric inverting RC Schmitt oscillator with switching thresholds at ±β times saturation voltage.",
  inputs: [
    {
      id: "resistanceOhms",
      kind: "number",
      label: "Resistance Ohms",
      unit: "Ω",
      minimum: 0,
    },
    {
      id: "capacitanceFarads",
      kind: "number",
      label: "Capacitance Farads",
      unit: "F",
      minimum: 0,
    },
    {
      id: "thresholdFraction",
      kind: "number",
      label: "Threshold Fraction",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "frequencyHz", kind: "number", label: "Frequency Hz", unit: "Hz" },
  ],
  calculate: (input) =>
    calculateSchmittOscillatorFrequency({
      resistanceOhms: input.resistanceOhms as number,
      capacitanceFarads: input.capacitanceFarads as number,
      thresholdFraction: input.thresholdFraction as number,
    }),
});
export const schmittOscillatorFrequencyTool = tool;
export const runSchmittOscillatorFrequency = tool.execute;
export default tool;
