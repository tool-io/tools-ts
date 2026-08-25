import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const dnaConcentrationOd260Example = {
  input: { absorbance260: 0.5, dilutionFactor: 2 },
} satisfies ToolExample<{
  readonly absorbance260: number;
  readonly dilutionFactor: number;
}>;

export const dnaConcentrationOd260Tool = createSimpleTool({
  id: "biology/dna-concentration-od260",
  title: "DNA Conc From A260",
  description:
    "Convert an A260 absorbance reading into double-stranded DNA concentration using the 50 ng/µL per absorbance unit factor.",
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
      id: "dnaConcentrationNgUl",
      label: "DNA concentration",
      kind: "number",
      unit: "ng/µL",
    },
  ],
  calculate: (input) => ({
    dnaConcentrationNgUl:
      (input.absorbance260 as number) * (input.dilutionFactor as number) * 50,
  }),
});
export const runDnaConcentrationOd260 = dnaConcentrationOd260Tool.execute;
export default dnaConcentrationOd260Tool;
