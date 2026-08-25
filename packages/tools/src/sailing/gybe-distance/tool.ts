import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GybeDistanceInput = {
  readonly lateralOffsetNm: number;
  readonly gybeAngleDeg: number;
};

export type GybeDistanceOutput = {
  readonly distanceNm: number;
};

export const gybeDistanceExample = {
  input: { gybeAngleDeg: 135, lateralOffsetNm: 2 },
  output: { distanceNm: 2.82842712474619 },
} satisfies ToolExample<GybeDistanceInput, GybeDistanceOutput>;

export const calculateGybeDistance = (
  input: GybeDistanceInput,
): GybeDistanceOutput => {
  if (input.gybeAngleDeg <= 0 || input.gybeAngleDeg >= 180)
    simpleError(
      "gybeAngleDeg",
      "The gybe angle must be between zero and one hundred eighty degrees.",
      "invalid_gybe_angle",
    );
  return {
    distanceNm:
      Math.abs(input.lateralOffsetNm) /
      Math.sin((input.gybeAngleDeg * Math.PI) / 180),
  };
};

export const gybeDistanceTool = createSimpleTool({
  calculate: (input) =>
    calculateGybeDistance(input as unknown as GybeDistanceInput),
  description:
    "Compute the distance sailed during a gybe to cover a given lateral offset.",
  id: "sailing/gybe-distance",
  inputs: [
    {
      description: "Perpendicular offset to close.",
      id: "lateralOffsetNm",
      kind: "number",
      label: "Lateral offset",
      unit: "nm",
    },
    {
      description: "Angle between the gybe and the offset direction.",
      id: "gybeAngleDeg",
      kind: "number",
      label: "Gybe angle",
      unit: "°",
    },
  ],
  outputs: [
    {
      description: "Distance sailed along the gybe.",
      format: "length-nm",
      id: "distanceNm",
      kind: "number",
      label: "Gybe distance",
      unit: "nm",
    },
  ],
  title: "Gybe Distance Calculator",
});
export const runGybeDistance = gybeDistanceTool.execute;
export default gybeDistanceTool;
