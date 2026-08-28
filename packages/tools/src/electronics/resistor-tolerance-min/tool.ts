import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ResistorToleranceMinInput = {
  readonly nominalOhms: number;
  readonly tolerancePercent: number;
};

export type ResistorToleranceMinOutput = {
  readonly minimumResistanceOhms: number;
};

export const resistorToleranceMinExample = {
  input: { nominalOhms: 1000, tolerancePercent: 5 },
  output: { minimumResistanceOhms: 950 },
} satisfies ToolExample<ResistorToleranceMinInput, ResistorToleranceMinOutput>;

export const resistorToleranceMinTool = createSimpleTool({
  id: "electronics/resistor-tolerance-min",
  title: "Min Resistance",
  description:
    "Compute the minimum resistance as nominal ohms times (1 - tolerance percent / 100).",
  inputs: [
    {
      id: "nominalOhms",
      label: "Nominal resistance",
      kind: "number",
      unit: "Ω",
    },
    {
      id: "tolerancePercent",
      label: "Tolerance",
      kind: "number",
      maximum: 20,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "minimumResistanceOhms",
      label: "Minimum resistance",
      kind: "number",
      unit: "Ω",
    },
  ],
  calculate: (input) => {
    const nominalOhms = input.nominalOhms as number;
    if (!(nominalOhms > 0))
      simpleError(
        "nominalOhms",
        "Nominal resistance must be positive.",
        "invalid_resistance",
      );
    return {
      minimumResistanceOhms:
        nominalOhms * (1 - (input.tolerancePercent as number) / 100),
    };
  },
});
export const runResistorToleranceMin = resistorToleranceMinTool.execute;
export default resistorToleranceMinTool;
