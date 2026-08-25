import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DistanceToLaylineInput = {
  readonly lateralOffsetNm: number;
  readonly tackingAngleDeg: number;
};

export type DistanceToLaylineOutput = {
  readonly distanceToLaylineNm: number;
};

export const distanceToLaylineExample = {
  input: { lateralOffsetNm: 2, tackingAngleDeg: 40 },
  output: { distanceToLaylineNm: 5.494954838909245 },
} satisfies ToolExample<DistanceToLaylineInput, DistanceToLaylineOutput>;

export const distanceToLaylineTool = createSimpleTool({
  calculate: (input) => {
    const tackingAngleDeg = input.tackingAngleDeg as number;
    if (tackingAngleDeg <= 0 || tackingAngleDeg >= 180)
      simpleError(
        "tackingAngleDeg",
        "The angle between the two upwind courses must be greater than zero and less than 180 degrees.",
        "out_of_range",
      );
    const lateralOffsetNm = input.lateralOffsetNm as number;
    return {
      distanceToLaylineNm: Math.abs(
        lateralOffsetNm / Math.tan((tackingAngleDeg * Math.PI) / (2 * 180)),
      ),
    };
  },
  description:
    "Calculate the distance along the course centerline to a layline from the lateral offset and half of the total angle between port and starboard tacks.",
  id: "sailing/distance-to-layline",
  inputs: [
    {
      description:
        "Perpendicular distance from the course to the mark; may be zero or negative for either side.",
      id: "lateralOffsetNm",
      kind: "number",
      label: "Lateral offset",
      unit: "nm",
    },
    {
      description: "Total angle between the port- and starboard-tack courses.",
      id: "tackingAngleDeg",
      kind: "number",
      label: "Tacking angle",
      maximum: 180,
      minimum: 0,
      unit: "deg",
    },
  ],
  outputs: [
    {
      description: "Straight-line distance along the course to the layline.",
      id: "distanceToLaylineNm",
      kind: "number",
      label: "Distance to layline",
      unit: "nm",
    },
  ],
  title: "Distance to Layline Calculator",
});
export const runDistanceToLayline = distanceToLaylineTool.execute;
export default distanceToLaylineTool;
