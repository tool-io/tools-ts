import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const primerConcentrationNmExample = {
  input: { concentrationNgUl: 50, lengthNt: 20 },
} satisfies ToolExample<{
  readonly concentrationNgUl: number;
  readonly lengthNt: number;
}>;

export const primerConcentrationNmTool = createSimpleTool({
  id: "biology/primer-concentration-nm",
  title: "Primer Concentration nM",
  description:
    "Convert a single-stranded DNA primer mass concentration in ng per microlitre to nanomolar using an approximate average nucleotide mass of 330 grams per mole.",
  inputs: [
    {
      id: "concentrationNgUl",
      label: "Concentration ng/µL",
      kind: "number",
    },
    {
      id: "lengthNt",
      label: "Length nt",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "primerConcentrationNm",
      label: "Primer concentration nM",
      kind: "number",
      unit: "nM",
    },
  ],
  calculate: (input) => {
    const concentrationNgUl = input.concentrationNgUl as number;
    const lengthNt = input.lengthNt as number;
    if (concentrationNgUl <= 0)
      simpleError(
        "concentrationNgUl",
        "Concentration must be greater than zero.",
      );
    return {
      primerConcentrationNm: (concentrationNgUl / (lengthNt * 330)) * 1000000,
    };
  },
});
export const runPrimerConcentrationNm = primerConcentrationNmTool.execute;
export default primerConcentrationNmTool;
