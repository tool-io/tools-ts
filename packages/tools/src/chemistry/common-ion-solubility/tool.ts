import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CommonIonSolubilityInput = {
  readonly commonIonConcM: number;
  readonly ksp: number;
};

export type CommonIonSolubilityOutput = {
  readonly molarSolubility: number;
};

export const commonIonSolubilityExample = {
  input: { commonIonConcM: 0.1, ksp: 1.8e-10 },
  output: { molarSolubility: 1.8e-9 },
} satisfies ToolExample<CommonIonSolubilityInput, CommonIonSolubilityOutput>;

export const commonIonSolubilityTool = createSimpleTool({
  id: "chemistry/common-ion-solubility",
  title: "Common Ion Solubility",
  description:
    "Approximate molar solubility of an AB salt with a large excess of a common ion.",
  inputs: [
    {
      id: "commonIonConcM",
      label: "Common ion concentration",
      kind: "number",
      unit: "M",
    },
    { id: "ksp", label: "Ksp", kind: "number" },
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
    const commonIonConcM = input.commonIonConcM as number;
    const ksp = input.ksp as number;
    if (commonIonConcM <= 0)
      simpleError(
        "commonIonConcM",
        "Common ion concentration must be positive.",
      );
    if (ksp <= 0) simpleError("ksp", "Ksp must be positive.");
    return { molarSolubility: ksp / commonIonConcM };
  },
});
export const runCommonIonSolubility = commonIonSolubilityTool.execute;
export default commonIonSolubilityTool;
