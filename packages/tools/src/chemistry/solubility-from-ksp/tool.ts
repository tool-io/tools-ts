import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SolubilityForm = "ab" | "ab2";

export type SolubilityFromKspInput = {
  readonly form?: SolubilityForm;
  readonly ksp: number;
};

export type SolubilityFromKspOutput = {
  readonly molarSolubility: number;
};

export const solubilityFromKspExample = {
  input: { form: "ab", ksp: 1e-10 },
  output: { molarSolubility: 0.00001 },
} satisfies ToolExample<SolubilityFromKspInput, SolubilityFromKspOutput>;

export const solubilityFromKspTool = createSimpleTool({
  id: "chemistry/solubility-from-ksp",
  title: "Solubility From Ksp",
  description:
    "Compute molar solubility from the solubility product for AB or AB2 salts.",
  inputs: [
    { id: "ksp", label: "Ksp", kind: "number" },
    {
      default: "ab",
      enum: ["ab", "ab2"],
      id: "form",
      kind: "string",
      label: "Salt form",
    },
  ],
  outputs: [
    {
      id: "molarSolubility",
      label: "Molar solubility",
      kind: "number",
      unit: "M",
    },
  ],
  calculate: (input) => {
    const ksp = input.ksp as number;
    if (ksp <= 0) simpleError("ksp", "Ksp must be positive.");
    return {
      molarSolubility:
        input.form === "ab2" ? Math.cbrt(ksp / 4) : Math.sqrt(ksp),
    };
  },
});
export const runSolubilityFromKsp = solubilityFromKspTool.execute;
export default solubilityFromKspTool;
