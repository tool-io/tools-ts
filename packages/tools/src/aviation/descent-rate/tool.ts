import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type DescentRateInput = {
  readonly descentAngleDeg: number;
  readonly groundSpeedKt: number;
};

export type DescentRateOutput = {
  readonly rateFpm: number;
};

/** Feet per minute of vertical speed per knot of ground speed at one degree. */
const FPM_PER_KT_PER_DEG = 101.26859142606666;

export const descentRateExample = {
  input: { descentAngleDeg: 3, groundSpeedKt: 120 },
  output: { rateFpm: 636.871438531 },
} satisfies ToolExample<DescentRateInput, DescentRateOutput>;

export const calculateDescentRate = (
  input: DescentRateInput,
): DescentRateOutput => {
  const angle = input.descentAngleDeg;
  if (angle <= 0 || angle >= 90)
    simpleError(
      "descentAngleDeg",
      "The descent angle must be between zero and ninety degrees.",
      "invalid_angle",
    );
  return {
    rateFpm: roundStatistic(
      Math.tan((angle * Math.PI) / 180) *
        input.groundSpeedKt *
        FPM_PER_KT_PER_DEG,
    ),
  };
};

export const descentRateTool = createSimpleTool({
  calculate: (input) =>
    calculateDescentRate(input as unknown as DescentRateInput),
  description:
    "Compute the vertical speed needed to hold a descent angle at a given ground speed.",
  id: "aviation/descent-rate",
  inputs: [
    {
      description: "Flight path angle of the descent.",
      id: "descentAngleDeg",
      kind: "number",
      label: "Descent angle",
      unit: "°",
    },
    {
      description: "Ground speed during the descent.",
      id: "groundSpeedKt",
      kind: "number",
      label: "Ground speed",
      unit: "kt",
    },
  ],
  outputs: [
    {
      description: "Required vertical speed.",
      format: "vertical-speed-fpm",
      id: "rateFpm",
      kind: "number",
      label: "Descent rate",
      unit: "ft/min",
    },
  ],
  title: "Descent Rate Calculator",
});
export const runDescentRate = descentRateTool.execute;
export default descentRateTool;
