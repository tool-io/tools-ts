import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const hipHeightWeightExample = {
  input: { girthCm: 175, hipHeightCm: 140 },
} satisfies ToolExample<{
  readonly girthCm: number;
  readonly hipHeightCm: number;
}>;

export const hipHeightWeightTool = createSimpleTool({
  id: "biology/hip-height-weight",
  title: "Hip Height Index",
  description:
    "Compute the hip height index as a percentage of hip height over heart girth.",
  inputs: [
    { id: "hipHeightCm", label: "Hip height cm", kind: "number" },
    { id: "girthCm", label: "Heart girth cm", kind: "number" },
  ],
  outputs: [
    { id: "hipHeightIndex", label: "Hip height index", kind: "number" },
  ],
  calculate: (input) => {
    const hipHeightCm = input.hipHeightCm as number;
    const girthCm = input.girthCm as number;
    if (hipHeightCm <= 0)
      simpleError("hipHeightCm", "Hip height must be greater than zero.");
    if (girthCm <= 0)
      simpleError("girthCm", "Heart girth must be greater than zero.");
    return {
      hipHeightIndex: (hipHeightCm / girthCm) * 100,
    };
  },
});
export const runHipHeightWeight = hipHeightWeightTool.execute;
export default hipHeightWeightTool;
