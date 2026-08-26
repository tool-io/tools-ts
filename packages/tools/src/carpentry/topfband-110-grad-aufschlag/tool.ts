import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type HingeCupPatternInput = {
  readonly edgeDistanceMm?: number;
};

export type HingeCupPatternOutput = {
  readonly cupDiameterMm: number;
  readonly minimumStileWidthMm: number;
};

const CUP_DIAMETER_MM = 35;
const DEFAULT_EDGE_DISTANCE_MM = 3.5;

export const hingeCupPatternExample = {
  input: {},
  output: { cupDiameterMm: 35, minimumStileWidthMm: 42 },
} satisfies ToolExample<HingeCupPatternInput, HingeCupPatternOutput>;

export const hingeCupPatternTool = createSimpleTool({
  id: "carpentry/topfband-110-grad-aufschlag",
  title: "110 Degree Hinge Cup Pattern",
  description:
    "Compute the minimum door stile width for a 110 degree overlay hinge cup from the cup edge distance.",
  inputs: [
    {
      default: 3.5,
      description:
        "Distance from the door edge to the cup center in millimeters.",
      id: "edgeDistanceMm",
      kind: "number",
      label: "Edge distance",
      maximum: 7,
      minimum: 3,
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Hinge cup diameter in millimeters.",
      id: "cupDiameterMm",
      kind: "number",
      label: "Cup diameter",
      unit: "mm",
    },
    {
      description:
        "Minimum stile width in millimeters, the cup diameter plus twice the edge distance.",
      id: "minimumStileWidthMm",
      kind: "number",
      label: "Minimum stile width",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const edgeDistanceMm =
      input.edgeDistanceMm === undefined
        ? DEFAULT_EDGE_DISTANCE_MM
        : (input.edgeDistanceMm as number);
    return {
      cupDiameterMm: CUP_DIAMETER_MM,
      minimumStileWidthMm: CUP_DIAMETER_MM + 2 * edgeDistanceMm,
    };
  },
});
export const runHingeCupPattern = hingeCupPatternTool.execute;
export default hingeCupPatternTool;
