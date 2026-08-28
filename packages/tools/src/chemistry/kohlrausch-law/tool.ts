import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const KohlrauschLawTool = createSimpleTool({
  id: "chemistry/kohlrausch-law",
  title: "Kohlrausch Law Calculator",
  description: "Compute limiting molar conductivity from ionic contributions.",
  inputs: [
    {
      id: "cationConductivitySCm2Mol",
      label: "Lambda+",
      kind: "number",
      minimum: 0,
      unit: "S*cm2/mol",
    },
    { id: "cationCoeff", label: "Nu+", kind: "integer", minimum: 1 },
    {
      id: "anionConductivitySCm2Mol",
      label: "Lambda-",
      kind: "number",
      minimum: 0,
      unit: "S*cm2/mol",
    },
    { id: "anionCoeff", label: "Nu-", kind: "integer", minimum: 1 },
  ],
  outputs: [
    {
      id: "limitingMolarConductivitySCm2Mol",
      label: "Limiting Lambda",
      kind: "number",
      unit: "S*cm2/mol",
    },
  ],
  calculate: (input) => {
    return {
      limitingMolarConductivitySCm2Mol:
        (input.cationCoeff as number) *
          (input.cationConductivitySCm2Mol as number) +
        (input.anionCoeff as number) *
          (input.anionConductivitySCm2Mol as number),
    };
  },
});
export default KohlrauschLawTool;
export const runKohlrauschLaw = KohlrauschLawTool.execute;

export type KohlrauschLawInput = {
  readonly cationConductivitySCm2Mol: number;
  readonly cationCoeff: number;
  readonly anionConductivitySCm2Mol: number;
  readonly anionCoeff: number;
};

export type KohlrauschLawOutput = {
  readonly limitingMolarConductivitySCm2Mol: number;
};

export const kohlrauschLawExample = {
  input: {
    cationConductivitySCm2Mol: 1,
    cationCoeff: 1,
    anionConductivitySCm2Mol: 1,
    anionCoeff: 1,
  },
  output: {
    limitingMolarConductivitySCm2Mol: 2,
  },
} satisfies ToolExample<KohlrauschLawInput, KohlrauschLawOutput>;
