import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type QFactorInput = {
  readonly capacitanceF: number;
  readonly inductanceH: number;
  readonly resistanceOhms: number;
};

export type QFactorOutput = {
  readonly qualityFactor: number;
};

export const qFactorExample = {
  input: {
    capacitanceF: 1e-6,
    inductanceH: 0.01,
    resistanceOhms: 10,
  },
  output: { qualityFactor: 10 },
} satisfies ToolExample<QFactorInput, QFactorOutput>;

export const calculateQFactor = (input: QFactorInput): QFactorOutput => {
  if (input.inductanceH <= 0 || input.capacitanceF <= 0)
    simpleError(
      "capacitanceF",
      "Inductance and capacitance must be positive.",
      "invalid_input",
    );
  if (input.resistanceOhms <= 0)
    simpleError(
      "resistanceOhms",
      "The series resistance must be positive.",
      "invalid_input",
    );
  return {
    qualityFactor:
      Math.sqrt(input.inductanceH / input.capacitanceF) / input.resistanceOhms,
  };
};

export const qFactorTool = createSimpleTool({
  calculate: (input) => calculateQFactor(input as unknown as QFactorInput),
  description:
    "Compute the quality factor of a series RLC resonator, Q = sqrt(L / C) / R = (omega0 * L) / R; a higher Q means lower damping and a narrower resonance bandwidth.",
  id: "electronics/q-factor",
  inputs: [
    {
      description: "Tank capacitance.",
      id: "capacitanceF",
      kind: "number",
      label: "Capacitance",
      unit: "F",
    },
    {
      description: "Tank inductance.",
      id: "inductanceH",
      kind: "number",
      label: "Inductance",
      unit: "H",
    },
    {
      description: "Series resistance representing the circuit losses.",
      format: "resistance",
      id: "resistanceOhms",
      kind: "number",
      label: "Resistance",
      unit: "Ω",
    },
  ],
  outputs: [
    {
      description: "Dimensionless quality factor of the series resonator.",
      format: "factor",
      id: "qualityFactor",
      kind: "number",
      label: "Quality factor",
    },
  ],
  title: "Resonant Circuit Q Factor Calculator",
});
export const runQFactor = qFactorTool.execute;
export default qFactorTool;
