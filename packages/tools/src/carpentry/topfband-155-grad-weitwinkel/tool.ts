import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type HingeCupPatternInput = {
  readonly edgeDistanceMm: number;
};

export type HingeCupPatternOutput = {
  readonly cupDiameterMm: number;
  readonly openingAngleDegrees: number;
  readonly minimumStileWidthMm: number;
};

export const hingeCupPatternExample = {
  input: { edgeDistanceMm: 3.5 },
  output: {
    cupDiameterMm: 35,
    openingAngleDegrees: 155,
    minimumStileWidthMm: 42,
  },
} satisfies ToolExample<HingeCupPatternInput, HingeCupPatternOutput>;

export const hingeCupPatternTool = createSimpleTool({
  id: "carpentry/topfband-155-grad-weitwinkel",
  title: "155 Degree Hinge Cup Pattern",
  description:
    "Compute the minimum stile width for a 35 mm hinge cup opened to 155 degrees.",
  inputs: [
    {
      default: 3.5,
      description:
        "Distance from the door edge to the center of the hinge cup in millimeters.",
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
      description: "Standard hinge cup bore diameter in millimeters.",
      id: "cupDiameterMm",
      kind: "number",
      label: "Cup diameter",
      unit: "mm",
    },
    {
      description: "Hinge opening angle in degrees.",
      id: "openingAngleDegrees",
      kind: "number",
      label: "Opening angle",
      unit: "°",
    },
    {
      description: "Minimum stile width in millimeters.",
      id: "minimumStileWidthMm",
      kind: "number",
      label: "Minimum stile width",
      unit: "mm",
    },
  ],
  calculate: (input) => ({
    cupDiameterMm: 35,
    openingAngleDegrees: 155,
    minimumStileWidthMm: 35 + 2 * (input.edgeDistanceMm as number),
  }),
});
export const runHingeCupPattern = hingeCupPatternTool.execute;
export default hingeCupPatternTool;
