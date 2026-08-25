import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ApparentWindAngleInput = {
  readonly boatSpeedKt: number;
  readonly trueWindAngleDeg: number;
  readonly trueWindSpeedKt: number;
};

export type ApparentWindAngleOutput = {
  readonly apparentWindAngleDeg: number;
};

export const apparentWindAngleExample = {
  input: { boatSpeedKt: 6, trueWindAngleDeg: 45, trueWindSpeedKt: 15 },
  output: { apparentWindAngleDeg: 32.56628571609302 },
} satisfies ToolExample<ApparentWindAngleInput, ApparentWindAngleOutput>;

export const calculateApparentWindAngle = (
  input: ApparentWindAngleInput,
): ApparentWindAngleOutput => {
  if (input.trueWindSpeedKt < 0 || input.boatSpeedKt < 0)
    simpleError(
      "trueWindSpeedKt",
      "Wind speed and boat speed cannot be negative.",
      "invalid_speed",
    );
  if (input.trueWindAngleDeg < 0 || input.trueWindAngleDeg > 360)
    simpleError(
      "trueWindAngleDeg",
      "True wind angle must be between zero and 360 degrees.",
      "invalid_angle",
    );
  const rad = (input.trueWindAngleDeg * Math.PI) / 180;
  const tws = input.trueWindSpeedKt;
  const bs = input.boatSpeedKt;
  const y = tws * Math.sin(rad);
  const x = tws * Math.cos(rad) + bs;
  if (x === 0 && y === 0)
    simpleError(
      "boatSpeedKt",
      "Apparent wind angle is undefined when wind and boat cancel exactly.",
      "degenerate_triangle",
    );
  return {
    apparentWindAngleDeg: (Math.atan2(y, x) * 180) / Math.PI,
  };
};

export const apparentWindAngleTool = createSimpleTool({
  calculate: (input) =>
    calculateApparentWindAngle(input as unknown as ApparentWindAngleInput),
  description:
    "Compute the apparent wind angle from true wind speed, boat speed, and true wind angle.",
  id: "sailing/apparent-wind-angle",
  inputs: [
    {
      description: "True wind speed.",
      id: "trueWindSpeedKt",
      kind: "number",
      label: "TWS",
      minimum: 0,
      unit: "kt",
    },
    {
      description: "Boat speed through the water.",
      id: "boatSpeedKt",
      kind: "number",
      label: "Boat speed",
      minimum: 0,
      unit: "kt",
    },
    {
      description: "True wind angle relative to the bow.",
      id: "trueWindAngleDeg",
      kind: "number",
      label: "TWA",
      maximum: 360,
      minimum: 0,
      unit: "°",
    },
  ],
  outputs: [
    {
      description: "Apparent wind angle relative to the bow.",
      format: "angle",
      id: "apparentWindAngleDeg",
      kind: "number",
      label: "AWA",
      unit: "°",
    },
  ],
  title: "Apparent Wind Angle Calculator",
});
export const runApparentWindAngle = apparentWindAngleTool.execute;
export default apparentWindAngleTool;
