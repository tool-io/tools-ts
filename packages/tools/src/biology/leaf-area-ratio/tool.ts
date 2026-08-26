import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LeafAreaRatioInput = {
  readonly totalLeafAreaCm2: number;
  readonly plantDryMassG: number;
};

export type LeafAreaRatioOutput = {
  readonly leafAreaRatio: number;
};

export const leafAreaRatioExample = {
  input: { totalLeafAreaCm2: 300, plantDryMassG: 6 },
  output: { leafAreaRatio: 50 },
} satisfies ToolExample<LeafAreaRatioInput, LeafAreaRatioOutput>;

export const leafAreaRatioTool = createSimpleTool({
  id: "biology/leaf-area-ratio",
  title: "Leaf Area Ratio",
  description:
    "Compute the leaf area ratio in square centimetres of leaf per gram of total plant dry mass.",
  inputs: [
    {
      id: "totalLeafAreaCm2",
      kind: "number",
      label: "Total leaf area",
      unit: "cm²",
    },
    {
      id: "plantDryMassG",
      kind: "number",
      label: "Plant dry mass",
      unit: "g",
    },
  ],
  outputs: [
    {
      id: "leafAreaRatio",
      kind: "number",
      label: "Leaf area ratio",
      unit: "cm²/g",
    },
  ],
  calculate: (input) => {
    const totalLeafAreaCm2 = input.totalLeafAreaCm2 as number;
    const plantDryMassG = input.plantDryMassG as number;
    if (!(totalLeafAreaCm2 > 0))
      simpleError(
        "totalLeafAreaCm2",
        "The total leaf area must be greater than zero.",
      );
    if (!(plantDryMassG > 0))
      simpleError(
        "plantDryMassG",
        "The plant dry mass must be greater than zero.",
      );
    return { leafAreaRatio: totalLeafAreaCm2 / plantDryMassG };
  },
});
export const runLeafAreaRatio = leafAreaRatioTool.execute;
export default leafAreaRatioTool;
