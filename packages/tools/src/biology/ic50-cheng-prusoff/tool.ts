import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const ic50ChengPrusoffExample = {
  input: { ic50ObservedNanomolar: 25, kd: 5, ligandConc: 50 },
  output: { trueKiNanomolar: 2.272727272727273 },
} satisfies ToolExample<
  {
    readonly ic50ObservedNanomolar: number;
    readonly kd: number;
    readonly ligandConc: number;
  },
  { readonly trueKiNanomolar: number }
>;

export const ic50ChengPrusoffTool = createSimpleTool({
  id: "biology/ic50-cheng-prusoff",
  title: "Cheng-Prusoff IC50",
  description:
    "Convert an observed IC50 from a competitive binding assay to Ki with the Cheng-Prusoff equation: Ki = IC50 / (1 + [L]/Kd). The relationship assumes equilibrium competition at a single binding site without substantial tracer depletion.",
  inputs: [
    {
      description:
        "Observed half-maximal inhibitory concentration in nanomolar; must be greater than zero.",
      id: "ic50ObservedNanomolar",
      label: "Observed IC50",
      kind: "number",
      unit: "nM",
    },
    {
      description:
        "Radioligand concentration used in the assay, in nanomolar; may be zero.",
      id: "ligandConc",
      label: "Ligand concentration",
      kind: "number",
      minimum: 0,
      unit: "nM",
    },
    {
      description:
        "Radioligand dissociation constant, in nanomolar; must be greater than zero.",
      id: "kd",
      label: "Kd",
      kind: "number",
      unit: "nM",
    },
  ],
  outputs: [
    {
      description: "True inhibition constant in nanomolar after correction.",
      id: "trueKiNanomolar",
      label: "True Ki",
      kind: "number",
      unit: "nM",
    },
  ],
  calculate: (input) => {
    const ic50ObservedNanomolar = input.ic50ObservedNanomolar as number;
    const kd = input.kd as number;
    const ligandConc = input.ligandConc as number;
    if (!(ic50ObservedNanomolar > 0))
      simpleError(
        "ic50ObservedNanomolar",
        "The observed IC50 must be greater than zero.",
        "invalid_ic50",
      );
    if (!(kd > 0))
      simpleError(
        "kd",
        "The dissociation constant must be greater than zero.",
        "invalid_kd",
      );
    return {
      trueKiNanomolar: ic50ObservedNanomolar / (1 + ligandConc / kd),
    };
  },
});
export const runIc50ChengPrusoff = ic50ChengPrusoffTool.execute;
export default ic50ChengPrusoffTool;
