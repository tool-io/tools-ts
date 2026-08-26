import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LeafPotassiumContentInput = {
  readonly leafDryMassG: number;
  readonly potassiumMassMg: number;
};

export type LeafPotassiumContentOutput = {
  readonly leafPotassiumMgPerG: number;
};

export const leafPotassiumContentExample = {
  input: { leafDryMassG: 2, potassiumMassMg: 15 },
  output: { leafPotassiumMgPerG: 7.5 },
} satisfies ToolExample<LeafPotassiumContentInput, LeafPotassiumContentOutput>;

export const leafPotassiumContentTool = createSimpleTool({
  id: "biology/leaf-potassium-content",
  title: "Leaf Potassium Content",
  description:
    "Compute leaf potassium content in milligrams per gram of leaf dry mass as the potassium mass divided by the leaf dry mass.",
  inputs: [
    {
      id: "potassiumMassMg",
      kind: "number",
      label: "Potassium mass",
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
      id: "leafPotassiumMgPerG",
      kind: "number",
      label: "Leaf potassium content",
      unit: "mg/g",
    },
  ],
  calculate: (input) => {
    const potassiumMassMg = input.potassiumMassMg as number;
    const leafDryMassG = input.leafDryMassG as number;
    if (!(potassiumMassMg > 0))
      simpleError(
        "potassiumMassMg",
        "The potassium mass must be greater than zero.",
      );
    if (!(leafDryMassG > 0))
      simpleError(
        "leafDryMassG",
        "The leaf dry mass must be greater than zero.",
      );
    return { leafPotassiumMgPerG: potassiumMassMg / leafDryMassG };
  },
});
export const runLeafPotassiumContent = leafPotassiumContentTool.execute;
export default leafPotassiumContentTool;
