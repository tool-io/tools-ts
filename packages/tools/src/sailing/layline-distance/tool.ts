import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LaylineDistanceInput = {
  readonly lateralOffsetNm: number;
  readonly tackAngleDeg: number;
};

export type LaylineDistanceOutput = {
  readonly distanceNm: number;
};

export const laylineDistanceExample = {
  input: { lateralOffsetNm: 2, tackAngleDeg: 45 },
  output: { distanceNm: 2.8284271247461903 },
} satisfies ToolExample<LaylineDistanceInput, LaylineDistanceOutput>;

export const calculateLaylineDistance = (
  input: LaylineDistanceInput,
): LaylineDistanceOutput => {
  if (input.tackAngleDeg <= 0 || input.tackAngleDeg >= 90)
    simpleError(
      "tackAngleDeg",
      "The tack angle must be between zero and ninety degrees.",
      "invalid_tack_angle",
    );
  return {
    distanceNm:
      Math.abs(input.lateralOffsetNm) /
      Math.sin((input.tackAngleDeg * Math.PI) / 180),
  };
};

export const laylineDistanceTool = createSimpleTool({
  calculate: (input) =>
    calculateLaylineDistance(input as unknown as LaylineDistanceInput),
  description:
    "Compute the distance along a layline to the mark given the lateral offset and tack angle.",
  id: "sailing/layline-distance",
  inputs: [
    {
      description: "Perpendicular offset from the mark bearing.",
      id: "lateralOffsetNm",
      kind: "number",
      label: "Lateral offset",
      unit: "nm",
    },
    {
      description: "Angle between the course and the layline.",
      id: "tackAngleDeg",
      kind: "number",
      label: "Tack angle",
      maximum: 90,
      minimum: 0,
      unit: "°",
    },
  ],
  outputs: [
    {
      description: "Distance to sail along the layline.",
      format: "length-nm",
      id: "distanceNm",
      kind: "number",
      label: "Distance",
      unit: "nm",
    },
  ],
  title: "Layline Distance Calculator",
});
export const runLaylineDistance = laylineDistanceTool.execute;
export default laylineDistanceTool;
