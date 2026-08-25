import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const cellDiameterFromAreaExample = {
  input: { areaUm2: 314.1592653589793 },
} satisfies ToolExample<{ readonly areaUm2: number }>;

export const cellDiameterFromAreaTool = createSimpleTool({
  id: "biology/cell-diameter-from-area",
  title: "Cell Diameter From Area",
  description:
    "Derive the diameter of a spherical cell from its surface area in square micrometers.",
  inputs: [
    {
      id: "areaUm2",
      label: "Surface area",
      kind: "number",
      unit: "\u00b5m\u00b2",
    },
  ],
  outputs: [
    {
      id: "cellDiameterUm",
      label: "Diameter",
      kind: "number",
      unit: "\u00b5m",
    },
  ],
  calculate: (input) => {
    const areaUm2 = input.areaUm2 as number;
    if (areaUm2 <= 0)
      simpleError("areaUm2", "Surface area must be positive.", "invalid_area");
    return { cellDiameterUm: 2 * Math.sqrt(areaUm2 / (4 * Math.PI)) };
  },
});
export const runCellDiameterFromArea = cellDiameterFromAreaTool.execute;
export default cellDiameterFromAreaTool;
