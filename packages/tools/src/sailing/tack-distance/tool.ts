import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TackDistanceInput = {
  readonly lateralOffsetNm: number;
  readonly tackAngleDeg: number;
};

export type TackDistanceOutput = {
  readonly distanceNm: number;
};

export const tackDistanceExample = {
  input: { lateralOffsetNm: 2, tackAngleDeg: 45 },
  output: { distanceNm: 2.8284271247461903 },
} satisfies ToolExample<TackDistanceInput, TackDistanceOutput>;

export const calculateTackDistance = (
  input: TackDistanceInput,
): TackDistanceOutput => {
  if (!(Number.isFinite(input.lateralOffsetNm) && input.lateralOffsetNm >= 0))
    simpleError(
      "lateralOffsetNm",
      "The lateral offset must be a finite, non-negative distance.",
      "invalid_offset",
    );
  if (input.tackAngleDeg <= 0 || input.tackAngleDeg >= 90)
    simpleError(
      "tackAngleDeg",
      "The tack angle must be between zero and ninety degrees.",
      "invalid_tack_angle",
    );
  return {
    distanceNm:
      input.lateralOffsetNm / Math.sin((input.tackAngleDeg * Math.PI) / 180),
  };
};

export const tackDistanceTool = createSimpleTool({
  calculate: (input) =>
    calculateTackDistance(input as unknown as TackDistanceInput),
  description:
    "Compute the distance sailed on one tack to cover a given lateral offset.",
  id: "sailing/tack-distance",
  inputs: [
    {
      description: "Perpendicular offset to close.",
      id: "lateralOffsetNm",
      kind: "number",
      label: "Lateral offset",
      minimum: 0,
      unit: "nm",
    },
    {
      description: "Angle between the tack and the offset direction.",
      id: "tackAngleDeg",
      kind: "number",
      label: "Tack angle",
      unit: "°",
    },
  ],
  outputs: [
    {
      description: "Distance sailed along the tack.",
      format: "length-nm",
      id: "distanceNm",
      kind: "number",
      label: "Tack distance",
      unit: "nm",
    },
  ],
  title: "Tack Distance Calculator",
});
export const runTackDistance = tackDistanceTool.execute;
export default tackDistanceTool;
