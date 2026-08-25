import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ApparentWindSpeedInput = {
  readonly boatSpeedKt: number;
  readonly trueWindAngleDeg: number;
  readonly trueWindSpeedKt: number;
};

export type ApparentWindSpeedOutput = {
  readonly apparentWindKt: number;
};

export const apparentWindSpeedExample = {
  input: { boatSpeedKt: 6, trueWindAngleDeg: 45, trueWindSpeedKt: 15 },
  output: { apparentWindKt: 19.704801968 },
} satisfies ToolExample<ApparentWindSpeedInput, ApparentWindSpeedOutput>;

export const calculateApparentWindSpeed = (
  input: ApparentWindSpeedInput,
): ApparentWindSpeedOutput => {
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
  return {
    apparentWindKt:
      Math.round(
        Math.sqrt(tws * tws + bs * bs + 2 * tws * bs * Math.cos(rad)) * 1e9,
      ) / 1e9,
  };
};

export const apparentWindSpeedTool = createSimpleTool({
  calculate: (input) =>
    calculateApparentWindSpeed(input as unknown as ApparentWindSpeedInput),
  description:
    "Compute the apparent wind speed from true wind speed, boat speed, and true wind angle.",
  id: "sailing/apparent-wind-speed",
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
      description: "True wind angle relative to the bow; zero is head-to-wind.",
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
      description: "Apparent wind speed felt on deck.",
      format: "speed",
      id: "apparentWindKt",
      kind: "number",
      label: "Apparent wind",
      unit: "kt",
    },
  ],
  title: "Apparent Wind Speed Calculator",
});
export const runApparentWindSpeed = apparentWindSpeedTool.execute;
export default apparentWindSpeedTool;
