import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ResistorToleranceMaxInput = {
  readonly nominalOhms: number;
  readonly tolerancePercent: number;
};

export type ResistorToleranceMaxOutput = {
  readonly maximumResistanceOhms: number;
};

export const resistorToleranceMaxExample = {
  input: { nominalOhms: 1000, tolerancePercent: 5 },
  output: { maximumResistanceOhms: 1050 },
} satisfies ToolExample<ResistorToleranceMaxInput, ResistorToleranceMaxOutput>;

export const resistorToleranceMaxTool = createSimpleTool({
  id: "electronics/resistor-tolerance-max",
  title: "Max Resistance",
  description:
    "Compute the maximum resistance as nominal ohms times (1 + tolerance percent / 100).",
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
      id: "maximumResistanceOhms",
      label: "Maximum resistance",
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
      maximumResistanceOhms:
        nominalOhms * (1 + (input.tolerancePercent as number) / 100),
    };
  },
});
export const runResistorToleranceMax = resistorToleranceMaxTool.execute;
export default resistorToleranceMaxTool;
