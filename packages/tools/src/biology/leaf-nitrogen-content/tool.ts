import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LeafNitrogenContentInput = {
  readonly leafDryMassG: number;
  readonly nitrogenMassMg: number;
};

export type LeafNitrogenContentOutput = {
  readonly leafNitrogenMgPerG: number;
};

export const leafNitrogenContentExample = {
  input: { leafDryMassG: 1.5, nitrogenMassMg: 24 },
  output: { leafNitrogenMgPerG: 16 },
} satisfies ToolExample<LeafNitrogenContentInput, LeafNitrogenContentOutput>;

export const leafNitrogenContentTool = createSimpleTool({
  id: "biology/leaf-nitrogen-content",
  title: "Leaf Nitrogen Content",
  description:
    "Compute leaf nitrogen content in milligrams per gram of leaf dry mass as the nitrogen mass divided by the leaf dry mass.",
  inputs: [
    {
      id: "nitrogenMassMg",
      kind: "number",
      label: "Nitrogen mass",
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
      id: "leafNitrogenMgPerG",
      kind: "number",
      label: "Leaf nitrogen content",
      unit: "mg/g",
    },
  ],
  calculate: (input) => {
    const nitrogenMassMg = input.nitrogenMassMg as number;
    const leafDryMassG = input.leafDryMassG as number;
    if (!(nitrogenMassMg > 0))
      simpleError(
        "nitrogenMassMg",
        "The nitrogen mass must be greater than zero.",
      );
    if (!(leafDryMassG > 0))
      simpleError(
        "leafDryMassG",
        "The leaf dry mass must be greater than zero.",
      );
    return { leafNitrogenMgPerG: nitrogenMassMg / leafDryMassG };
  },
});
export const runLeafNitrogenContent = leafNitrogenContentTool.execute;
export default leafNitrogenContentTool;
