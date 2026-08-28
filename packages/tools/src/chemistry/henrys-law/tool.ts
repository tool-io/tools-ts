import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HenrysLawInput = {
  readonly henryConstantMolLAtm: number;
  readonly partialPressureAtm: number;
};

export type HenrysLawOutput = {
  readonly concentrationM: number;
};

export const henrysLawExample = {
  input: { henryConstantMolLAtm: 0.034, partialPressureAtm: 2 },
  output: { concentrationM: 0.068 },
} satisfies ToolExample<HenrysLawInput, HenrysLawOutput>;

export const henrysLawTool = createSimpleTool({
  id: "chemistry/henrys-law",
  title: "Henry's Law Calculator",
  description:
    "Compute dissolved gas concentration from Henry's law constant and partial pressure.",
  inputs: [
    {
      id: "henryConstantMolLAtm",
      kind: "number",
      label: "Henry's law constant",
      unit: "mol/(L·atm)",
    },
    {
      id: "partialPressureAtm",
      kind: "number",
      label: "Partial pressure",
      unit: "atm",
    },
  ],
  outputs: [
    { id: "concentrationM", kind: "number", label: "Concentration", unit: "M" },
  ],
  calculate: (input) => {
    const henryConstantMolLAtm = input.henryConstantMolLAtm as number;
    const partialPressureAtm = input.partialPressureAtm as number;
    if (henryConstantMolLAtm <= 0)
      simpleError(
        "henryConstantMolLAtm",
        "Henry's law constant must be positive.",
      );
    if (partialPressureAtm < 0)
      simpleError("partialPressureAtm", "Partial pressure cannot be negative.");
    return { concentrationM: henryConstantMolLAtm * partialPressureAtm };
  },
});
export const runHenrysLaw = henrysLawTool.execute;
export default henrysLawTool;
