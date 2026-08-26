import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const leafAreaIndexExample = {
  input: { groundAreaM2: 10, totalLeafAreaM2: 50 },
  output: { leafAreaIndex: 5 },
} satisfies ToolExample<
  { readonly groundAreaM2: number; readonly totalLeafAreaM2: number },
  { readonly leafAreaIndex: number }
>;

export const leafAreaIndexTool = createSimpleTool({
  id: "biology/leaf-area-index",
  title: "LAI Calculator",
  description:
    "Compute the leaf area index as total one-sided leaf area divided by the ground surface area it covers.",
  inputs: [
    {
      description: "Total one-sided leaf area; must be greater than zero.",
      id: "totalLeafAreaM2",
      label: "Total leaf area",
      kind: "number",
      unit: "m^2",
    },
    {
      description: "Ground surface area; must be greater than zero.",
      id: "groundAreaM2",
      label: "Ground area",
      kind: "number",
      unit: "m^2",
    },
  ],
  outputs: [
    {
      description:
        "Leaf area index in square metres of leaf per square metre of ground.",
      id: "leafAreaIndex",
      label: "Leaf area index",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const totalLeafAreaM2 = input.totalLeafAreaM2 as number;
    const groundAreaM2 = input.groundAreaM2 as number;
    if (!(totalLeafAreaM2 > 0))
      simpleError(
        "totalLeafAreaM2",
        "The total leaf area must be greater than zero.",
      );
    if (!(groundAreaM2 > 0))
      simpleError("groundAreaM2", "The ground area must be greater than zero.");
    return { leafAreaIndex: totalLeafAreaM2 / groundAreaM2 };
  },
});
export const runLeafAreaIndex = leafAreaIndexTool.execute;
export default leafAreaIndexTool;
