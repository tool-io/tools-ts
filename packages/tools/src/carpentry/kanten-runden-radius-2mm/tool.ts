import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EdgeRoundingRemovalInput = {
  readonly radiusMm?: number;
};

export type EdgeRoundingRemovalOutput = {
  readonly removedCrossSectionAreaMm2: number;
};

export const edgeRoundingRemovalExample = {
  input: { radiusMm: 2 },
  output: { removedCrossSectionAreaMm2: 0.8584073464102069 },
} satisfies ToolExample<EdgeRoundingRemovalInput, EdgeRoundingRemovalOutput>;

export const edgeRoundingRemovalTool = createSimpleTool({
  id: "carpentry/kanten-runden-radius-2mm",
  title: "Edge Rounding Removal Calculator",
  description:
    "Calculate the cross-sectional area removed when a square corner is rounded to a quarter-circle of the specified radius.",
  inputs: [
    {
      default: 2,
      description: "Rounding radius applied to the edge.",
      id: "radiusMm",
      kind: "number",
      label: "Radius",
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Removed corner area per unit length of the edge.",
      id: "removedCrossSectionAreaMm2",
      kind: "number",
      label: "Removed cross-sectional area",
      unit: "mm²",
    },
  ],
  calculate: (input) => {
    const radiusMm = input.radiusMm as number;
    if (!(radiusMm > 0))
      simpleError(
        "radiusMm",
        "Radius must be greater than zero.",
        "invalid_radius",
      );
    return {
      removedCrossSectionAreaMm2: radiusMm * radiusMm * (1 - Math.PI / 4),
    };
  },
});
export const runEdgeRoundingRemoval = edgeRoundingRemovalTool.execute;
export default edgeRoundingRemovalTool;
