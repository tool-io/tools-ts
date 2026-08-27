import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const ribeyeAreaExample = {
  input: { heightCm: 15, widthCm: 10 },
} satisfies ToolExample<{
  readonly heightCm: number;
  readonly widthCm: number;
}>;

export const ribeyeAreaTool = createSimpleTool({
  id: "biology/ribeye-area",
  title: "Ribeye Area Ellipse",
  description:
    "Compute ribeye area in square centimetres by treating the eye of the longissimus muscle as an ellipse.",
  inputs: [
    { id: "widthCm", label: "Ribeye width cm", kind: "number" },
    { id: "heightCm", label: "Ribeye height cm", kind: "number" },
  ],
  outputs: [
    {
      id: "ribeyeAreaCm2",
      label: "Ribeye area cm²",
      kind: "number",
      unit: "cm²",
    },
  ],
  calculate: (input) => {
    const widthCm = input.widthCm as number;
    const heightCm = input.heightCm as number;
    if (widthCm <= 0)
      simpleError("widthCm", "Ribeye width must be greater than zero.");
    if (heightCm <= 0)
      simpleError("heightCm", "Ribeye height must be greater than zero.");
    return {
      ribeyeAreaCm2: (Math.PI * widthCm * heightCm) / 4,
    };
  },
});
export const runRibeyeArea = ribeyeAreaTool.execute;
export default ribeyeAreaTool;
