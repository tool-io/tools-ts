import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const CommonIonEffectFactorTool = createSimpleTool({
  id: "chemistry/common-ion-effect-factor",
  title: "Common Ion Effect Factor Calculator",
  description:
    "Compute solubility reduction factor from common ion concentration.",
  inputs: [
    { id: "ksp", label: "Ksp", kind: "number", minimum: 0 },
    {
      id: "commonIonConcMolL",
      label: "Common ion conc",
      kind: "number",
      minimum: 0,
      unit: "mol/L",
    },
  ],
  outputs: [
    {
      id: "solubilityReductionFactor",
      label: "New solubility",
      kind: "number",
      unit: "mol/L",
    },
  ],
  calculate: (input) => {
    const cic = input.commonIonConcMolL as number;
    if (cic <= 0)
      simpleError("commonIonConcMolL", ">0 required.", "invalid_common_ion");
    return { solubilityReductionFactor: (input.ksp as number) / cic };
  },
});
export default CommonIonEffectFactorTool;
export const runCommonIonEffectFactor = CommonIonEffectFactorTool.execute;

export type CommonIonEffectFactorInput = {
  readonly ksp: number;
  readonly commonIonConcMolL: number;
};

export type CommonIonEffectFactorOutput = {
  readonly solubilityReductionFactor: number;
};

export const commonIonEffectFactorExample = {
  input: {
    ksp: 1,
    commonIonConcMolL: 1,
  },
  output: {
    solubilityReductionFactor: 1,
  },
} satisfies ToolExample<
  CommonIonEffectFactorInput,
  CommonIonEffectFactorOutput
>;
