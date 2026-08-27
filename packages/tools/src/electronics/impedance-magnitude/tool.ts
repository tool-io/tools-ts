import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ImpedanceMagnitudeInput = {
  readonly capacitanceF: number;
  readonly frequencyHz: number;
  readonly inductanceH: number;
  readonly resistanceOhms: number;
};

export type ImpedanceMagnitudeOutput = {
  readonly impedanceOhms: number;
};

export const impedanceMagnitudeExample = {
  input: {
    capacitanceF: 1e-6,
    frequencyHz: 1000,
    inductanceH: 0.01,
    resistanceOhms: 50,
  },
  output: { impedanceOhms: 108.5271287329587 },
} satisfies ToolExample<ImpedanceMagnitudeInput, ImpedanceMagnitudeOutput>;

export const calculateImpedanceMagnitude = (
  input: ImpedanceMagnitudeInput,
): ImpedanceMagnitudeOutput => {
  if (input.capacitanceF <= 0 || input.frequencyHz <= 0)
    simpleError(
      "capacitanceF",
      "Capacitance and frequency must be positive.",
      "invalid_input",
    );
  if (input.resistanceOhms < 0 || input.inductanceH < 0)
    simpleError(
      "resistanceOhms",
      "Resistance and inductance cannot be negative.",
      "invalid_input",
    );
  const inductive = 2 * Math.PI * input.frequencyHz * input.inductanceH;
  const capacitive = 1 / (2 * Math.PI * input.frequencyHz * input.capacitanceF);
  const netReactance = inductive - capacitive;
  return {
    impedanceOhms: Math.sqrt(input.resistanceOhms ** 2 + netReactance ** 2),
  };
};

export const impedanceMagnitudeTool = createSimpleTool({
  calculate: (input) =>
    calculateImpedanceMagnitude(input as unknown as ImpedanceMagnitudeInput),
  description:
    "Compute series RLC impedance magnitude |Z| = sqrt(R^2 + (XL - XC)^2) at a given frequency.",
  id: "electronics/impedance-magnitude",
  inputs: [
    {
      description: "Capacitance in the series branch.",
      id: "capacitanceF",
      kind: "number",
      label: "Capacitance",
      unit: "F",
    },
    {
      description: "Frequency of the applied sinusoid.",
      id: "frequencyHz",
      kind: "number",
      label: "Frequency",
      unit: "Hz",
    },
    {
      description: "Inductance in the series branch.",
      id: "inductanceH",
      kind: "number",
      label: "Inductance",
      unit: "H",
    },
    {
      description: "Series resistance.",
      id: "resistanceOhms",
      kind: "number",
      label: "Resistance",
      unit: "Ω",
    },
  ],
  outputs: [
    {
      description: "Magnitude of the total series impedance.",
      format: "resistance",
      id: "impedanceOhms",
      kind: "number",
      label: "|Z|",
      unit: "Ω",
    },
  ],
  title: "Impedance Magnitude Calculator",
});
export const runImpedanceMagnitude = impedanceMagnitudeTool.execute;
export default impedanceMagnitudeTool;
