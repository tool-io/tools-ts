import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const cellSurfaceAreaExample = {
  input: { radiusUm: 5 },
} satisfies ToolExample<{ readonly radiusUm: number }>;

export const cellSurfaceAreaTool = createSimpleTool({
  id: "biology/cell-surface-area",
  title: "Cell Surface Area Sphere",
  description:
    "Compute the surface area of a spherical cell from its radius in micrometers.",
  inputs: [
    { id: "radiusUm", label: "Radius", kind: "number", unit: "\u00b5m" },
  ],
  outputs: [
    {
      id: "surfaceAreaUm2",
      label: "Surface area",
      kind: "number",
      unit: "\u00b5m\u00b2",
    },
  ],
  calculate: (input) => {
    const radiusUm = input.radiusUm as number;
    if (radiusUm <= 0)
      simpleError("radiusUm", "Radius must be positive.", "invalid_radius");
    return { surfaceAreaUm2: 4 * Math.PI * radiusUm * radiusUm };
  },
});
export const runCellSurfaceArea = cellSurfaceAreaTool.execute;
export default cellSurfaceAreaTool;
