import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SolidWoodLamellaInput = {
  readonly lamellaCount: number;
  readonly panelWidthMm: number;
};

export type SolidWoodLamellaOutput = {
  readonly recommendedLamellaWidthMm: number;
};

export const solidWoodLamellaExample = {
  input: { lamellaCount: 10, panelWidthMm: 960 },
  output: { recommendedLamellaWidthMm: 80 },
} satisfies ToolExample<SolidWoodLamellaInput, SolidWoodLamellaOutput>;

export const solidWoodLamellaTool = createSimpleTool({
  id: "carpentry/massivholz-lamellen-max-80mm",
  title: "Solid Wood Lamella Width Calculator",
  description:
    "Recommend a solid wood lamella width capped at 80 millimeters for a panel width and lamella count.",
  inputs: [
    {
      id: "panelWidthMm",
      kind: "number",
      label: "Panel width",
      unit: "mm",
    },
    {
      id: "lamellaCount",
      kind: "integer",
      label: "Lamella count",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "recommendedLamellaWidthMm",
      kind: "number",
      label: "Recommended lamella width",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const panelWidthMm = input.panelWidthMm as number;
    const lamellaCount = input.lamellaCount as number;
    if (!(panelWidthMm > 0))
      simpleError(
        "panelWidthMm",
        "Panel width must be greater than zero.",
        "invalid_panel_width",
      );
    return {
      recommendedLamellaWidthMm: Math.min(80, panelWidthMm / lamellaCount),
    };
  },
});
export const runSolidWoodLamella = solidWoodLamellaTool.execute;
export default solidWoodLamellaTool;
