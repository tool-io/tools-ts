import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LeafPhosphorusContentInput = {
  readonly leafDryMassG: number;
  readonly phosphorusMassMg: number;
};

export type LeafPhosphorusContentOutput = {
  readonly leafPhosphorusMgPerG: number;
};

export const leafPhosphorusContentExample = {
  input: { leafDryMassG: 2, phosphorusMassMg: 3 },
  output: { leafPhosphorusMgPerG: 1.5 },
} satisfies ToolExample<
  LeafPhosphorusContentInput,
  LeafPhosphorusContentOutput
>;

export const leafPhosphorusContentTool = createSimpleTool({
  id: "biology/leaf-phosphorus-content",
  title: "Leaf Phosphorus Content",
  description:
    "Compute leaf phosphorus content in milligrams per gram of leaf dry mass as the phosphorus mass divided by the leaf dry mass.",
  inputs: [
    {
      id: "phosphorusMassMg",
      kind: "number",
      label: "Phosphorus mass",
      unit: "mg",
    },
    {
      id: "leafDryMassG",
      kind: "number",
      label: "Leaf dry mass",
      unit: "g",
    },
  ],
  outputs: [
    {
      id: "leafPhosphorusMgPerG",
      kind: "number",
      label: "Leaf phosphorus content",
      unit: "mg/g",
    },
  ],
  calculate: (input) => {
    const phosphorusMassMg = input.phosphorusMassMg as number;
    const leafDryMassG = input.leafDryMassG as number;
    if (!(phosphorusMassMg > 0))
      simpleError(
        "phosphorusMassMg",
        "The phosphorus mass must be greater than zero.",
      );
    if (!(leafDryMassG > 0))
      simpleError(
        "leafDryMassG",
        "The leaf dry mass must be greater than zero.",
      );
    return { leafPhosphorusMgPerG: phosphorusMassMg / leafDryMassG };
  },
});
export const runLeafPhosphorusContent = leafPhosphorusContentTool.execute;
export default leafPhosphorusContentTool;
