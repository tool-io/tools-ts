import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CapacitiveReactanceInput = {
  readonly capacitanceF: number;
  readonly frequencyHz: number;
};

export type CapacitiveReactanceOutput = {
  readonly reactanceOhms: number;
};

export const capacitiveReactanceExample = {
  input: {
    capacitanceF: 1e-6,
    frequencyHz: 1000,
  },
  output: { reactanceOhms: 159.15494309189535 },
} satisfies ToolExample<CapacitiveReactanceInput, CapacitiveReactanceOutput>;

export const calculateCapacitiveReactance = (
  input: CapacitiveReactanceInput,
): CapacitiveReactanceOutput => {
  if (input.capacitanceF <= 0 || input.frequencyHz <= 0)
    simpleError(
      "capacitanceF",
      "Capacitance and frequency must be positive.",
      "invalid_input",
    );
  return {
    reactanceOhms: 1 / (2 * Math.PI * input.frequencyHz * input.capacitanceF),
  };
};

export const capacitiveReactanceTool = createSimpleTool({
  calculate: (input) =>
    calculateCapacitiveReactance(input as unknown as CapacitiveReactanceInput),
  description:
    "Compute capacitive reactance XC = 1 / (2 * pi * f * C), which shrinks as frequency or capacitance grows.",
  id: "electronics/capacitive-reactance",
  inputs: [
    {
      description: "Capacitance of the component.",
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
  ],
  outputs: [
    {
      description: "Magnitude of the capacitive reactance.",
      format: "resistance",
      id: "reactanceOhms",
      kind: "number",
      label: "XC",
      unit: "Ω",
    },
  ],
  title: "Capacitive Reactance Calculator",
});
export const runCapacitiveReactance = capacitiveReactanceTool.execute;
export default capacitiveReactanceTool;
