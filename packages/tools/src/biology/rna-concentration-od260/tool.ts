import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const rnaConcentrationOd260Example = {
  input: { absorbance260: 0.5 },
} satisfies ToolExample<{ readonly absorbance260: number }>;

export const rnaConcentrationOd260Tool = createSimpleTool({
  id: "biology/rna-concentration-od260",
  title: "RNA Conc From A260",
  description:
    "Convert an A260 absorbance reading into RNA concentration using the 40 ng/µL per absorbance unit factor.",
  inputs: [
    {
      id: "absorbance260",
      label: "Absorbance A260",
      kind: "number",
      minimum: 0,
    },
    {
      default: 1,
      id: "dilutionFactor",
      label: "Dilution factor",
      kind: "number",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "rnaConcentrationNgUl",
      label: "RNA concentration",
      kind: "number",
      unit: "ng/µL",
    },
  ],
  calculate: (input) => ({
    rnaConcentrationNgUl:
      (input.absorbance260 as number) * (input.dilutionFactor as number) * 40,
  }),
});
export const runRnaConcentrationOd260 = rnaConcentrationOd260Tool.execute;
export default rnaConcentrationOd260Tool;
