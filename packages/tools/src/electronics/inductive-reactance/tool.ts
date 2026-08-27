import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InductiveReactanceInput = {
  readonly frequencyHz: number;
  readonly inductanceH: number;
};

export type InductiveReactanceOutput = {
  readonly reactanceOhms: number;
};

export const inductiveReactanceExample = {
  input: {
    frequencyHz: 1000,
    inductanceH: 0.01,
  },
  output: { reactanceOhms: 62.83185307179586 },
} satisfies ToolExample<InductiveReactanceInput, InductiveReactanceOutput>;

export const calculateInductiveReactance = (
  input: InductiveReactanceInput,
): InductiveReactanceOutput => {
  if (input.inductanceH <= 0 || input.frequencyHz <= 0)
    simpleError(
      "inductanceH",
      "Inductance and frequency must be positive.",
      "invalid_input",
    );
  return {
    reactanceOhms: 2 * Math.PI * input.frequencyHz * input.inductanceH,
  };
};

export const inductiveReactanceTool = createSimpleTool({
  calculate: (input) =>
    calculateInductiveReactance(input as unknown as InductiveReactanceInput),
  description:
    "Compute inductive reactance XL = 2 * pi * f * L, which grows with frequency and inductance.",
  id: "electronics/inductive-reactance",
  inputs: [
    {
      description: "Frequency of the applied sinusoid.",
      id: "frequencyHz",
      kind: "number",
      label: "Frequency",
      unit: "Hz",
    },
    {
      description: "Inductance of the coil.",
      id: "inductanceH",
      kind: "number",
      label: "Inductance",
      unit: "H",
    },
  ],
  outputs: [
    {
      description: "Magnitude of the inductive reactance.",
      format: "resistance",
      id: "reactanceOhms",
      kind: "number",
      label: "XL",
      unit: "Ω",
    },
  ],
  title: "Inductive Reactance Calculator",
});
export const runInductiveReactance = inductiveReactanceTool.execute;
export default inductiveReactanceTool;
