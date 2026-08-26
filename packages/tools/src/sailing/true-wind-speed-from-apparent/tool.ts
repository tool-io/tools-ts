import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TrueWindFromApparentInput = {
  readonly apparentWindKt: number;
  readonly apparentWindAngleDeg: number;
  readonly boatSpeedKt: number;
};

export type TrueWindFromApparentOutput = {
  readonly trueWindSpeedKt: number;
};

export const trueWindSpeedFromApparentExample = {
  input: {
    apparentWindAngleDeg: 40,
    apparentWindKt: 19,
    boatSpeedKt: 6,
  },
  output: { trueWindSpeedKt: 14.911132317 },
} satisfies ToolExample<TrueWindFromApparentInput, TrueWindFromApparentOutput>;

export const calculateTrueWindFromApparent = (
  input: TrueWindFromApparentInput,
): TrueWindFromApparentOutput => {
  const aws = input.apparentWindKt;
  const bs = input.boatSpeedKt;
  if (!(Number.isFinite(aws) && aws >= 0))
    simpleError(
      "apparentWindKt",
      "Apparent wind speed must be finite and non-negative.",
      "invalid_speed",
    );
  if (!(Number.isFinite(bs) && bs >= 0))
    simpleError(
      "boatSpeedKt",
      "Boat speed must be finite and non-negative.",
      "invalid_speed",
    );
  if (!(
    Number.isFinite(input.apparentWindAngleDeg) &&
    input.apparentWindAngleDeg >= 0 &&
    input.apparentWindAngleDeg <= 180
  ))
    simpleError(
      "apparentWindAngleDeg",
      "Apparent wind angle must lie between zero and 180 degrees.",
      "invalid_angle",
    );
  const rad = (input.apparentWindAngleDeg * Math.PI) / 180;
  return {
    trueWindSpeedKt:
      Math.round(
        Math.sqrt(aws * aws + bs * bs - 2 * aws * bs * Math.cos(rad)) * 1e9,
      ) / 1e9,
  };
};

export const trueWindSpeedFromApparentTool = createSimpleTool({
  calculate: (input) =>
    calculateTrueWindFromApparent(
      input as unknown as TrueWindFromApparentInput,
    ),
  description:
    "Compute the true wind speed from apparent wind speed, apparent wind angle, and boat speed.",
  id: "sailing/true-wind-speed-from-apparent",
  inputs: [
    {
      description: "Apparent wind speed felt on deck.",
      id: "apparentWindKt",
      kind: "number",
      label: "AWS",
      minimum: 0,
      unit: "kt",
    },
    {
      description: "Apparent wind angle relative to the bow.",
      id: "apparentWindAngleDeg",
      kind: "number",
      label: "AWA",
      maximum: 180,
      minimum: 0,
      unit: "°",
    },
    {
      description: "Boat speed through the water.",
      id: "boatSpeedKt",
      kind: "number",
      label: "Boat speed",
      minimum: 0,
      unit: "kt",
    },
  ],
  outputs: [
    {
      description: "True wind speed over the water surface.",
      format: "speed",
      id: "trueWindSpeedKt",
      kind: "number",
      label: "TWS",
      unit: "kt",
    },
  ],
  title: "True Wind Speed From Apparent Calculator",
});
export const runTrueWindSpeedFromApparent =
  trueWindSpeedFromApparentTool.execute;
export default trueWindSpeedFromApparentTool;
