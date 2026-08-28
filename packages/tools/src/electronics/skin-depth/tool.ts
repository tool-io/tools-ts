import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SkinDepthInput = {
  readonly frequencyMHz: number;
};

export type SkinDepthOutput = {
  readonly skinDepthMicrometers: number;
};

export const skinDepthExample = {
  input: { frequencyMHz: 100 },
  output: { skinDepthMicrometers: 6.5200000000000005 },
} satisfies ToolExample<SkinDepthInput, SkinDepthOutput>;

export const skinDepthTool = createSimpleTool({
  calculate: (input) => {
    const { frequencyMHz } = input as unknown as SkinDepthInput;
    if (frequencyMHz <= 0)
      simpleError(
        "frequencyMHz",
        "Frequency must be positive.",
        "degenerate_input",
      );
    return { skinDepthMicrometers: 65.2 / Math.sqrt(frequencyMHz) };
  },
  description:
    "Compute the copper skin depth in micrometers at a given frequency in megahertz.",
  id: "electronics/skin-depth",
  inputs: [
    { id: "frequencyMHz", kind: "number", label: "Frequency", unit: "MHz" },
  ],
  outputs: [
    {
      id: "skinDepthMicrometers",
      kind: "number",
      label: "Skin depth",
      unit: "um",
    },
  ],
  title: "Skin Depth Copper",
});
export const runSkinDepth = skinDepthTool.execute;
export default skinDepthTool;
