import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CrystalLoadCapacitanceInput = {
  readonly clPf: number;
  readonly strayPf: number;
};

export type CrystalLoadCapacitanceOutput = {
  readonly externalCapacitorEachPf: number;
};

export const crystalLoadCapacitanceExample = {
  input: { clPf: 20, strayPf: 4 },
  output: { externalCapacitorEachPf: 32 },
} satisfies ToolExample<
  CrystalLoadCapacitanceInput,
  CrystalLoadCapacitanceOutput
>;

export const calculateCrystalLoadCapacitance = (
  input: CrystalLoadCapacitanceInput,
): CrystalLoadCapacitanceOutput => {
  if (!(input.clPf > 0) || !(input.strayPf > 0))
    simpleError(
      "clPf",
      "Load and stray capacitances must be positive.",
      "invalid_capacitance",
    );
  const eachPf = 2 * (input.clPf - input.strayPf);
  if (!(eachPf >= 0))
    simpleError(
      "strayPf",
      "Stray capacitance exceeds the specified load capacitance.",
      "negative_capacitance",
    );
  return { externalCapacitorEachPf: eachPf };
};

export const crystalLoadCapacitanceTool = createSimpleTool({
  calculate: (input) =>
    calculateCrystalLoadCapacitance(
      input as unknown as CrystalLoadCapacitanceInput,
    ),
  description:
    "Compute the external capacitor value required at each of the two crystal pins to meet a specified load capacitance.",
  id: "electronics/crystal-load-capacitance",
  inputs: [
    {
      description: "Load capacitance specified for the crystal.",
      format: "capacitance",
      id: "clPf",
      kind: "number",
      label: "Specified load capacitance",
      unit: "pF",
    },
    {
      description: "Parasitic stray capacitance seen at each pin.",
      format: "capacitance",
      id: "strayPf",
      kind: "number",
      label: "Stray capacitance",
      unit: "pF",
    },
  ],
  outputs: [
    {
      description: "External capacitor to place from each pin to ground.",
      format: "capacitance",
      id: "externalCapacitorEachPf",
      kind: "number",
      label: "External capacitor, each",
      unit: "pF",
    },
  ],
  title: "Crystal Load Caps Parallel",
});
export const runCrystalLoadCapacitance = crystalLoadCapacitanceTool.execute;
export default crystalLoadCapacitanceTool;
