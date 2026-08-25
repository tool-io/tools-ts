import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LeewayAngleInput = {
  readonly boatSpeedKt: number;
  readonly heelDeg: number;
  readonly kFactor?: number;
};

export type LeewayAngleOutput = {
  readonly leewayDeg: number;
};

const DEFAULT_K = 1.5;

export const leewayAngleExample = {
  input: { boatSpeedKt: 6, heelDeg: 20 },
  output: { leewayDeg: 0.833333333333 },
} satisfies ToolExample<LeewayAngleInput, LeewayAngleOutput>;

export const calculateLeewayAngle = (
  input: LeewayAngleInput,
): LeewayAngleOutput => {
  const k = input.kFactor ?? DEFAULT_K;
  if (input.heelDeg < 0 || input.boatSpeedKt <= 0 || k < 0)
    simpleError(
      "heelDeg",
      "Boat speed must be positive; heel and the empirical factor cannot be negative.",
      "invalid_input",
    );
  return {
    leewayDeg: Number(
      ((k * input.heelDeg) / input.boatSpeedKt ** 2).toPrecision(12),
    ),
  };
};

export const leewayAngleTool = createSimpleTool({
  calculate: (input) =>
    calculateLeewayAngle(input as unknown as LeewayAngleInput),
  description:
    "Estimate leeway angle with the empirical relation leeway = K times heel divided by boat speed squared. Calibrate K for the hull, keel, and knot-based speed data in use.",
  id: "sailing/leeway-angle",
  inputs: [
    {
      description: "Heel angle to windward.",
      id: "heelDeg",
      kind: "number",
      label: "Heel angle",
      unit: "°",
      minimum: 0,
    },
    {
      description: "Boat speed through the water.",
      id: "boatSpeedKt",
      kind: "number",
      label: "Boat speed",
      unit: "kt",
      minimum: 0,
    },
    {
      default: DEFAULT_K,
      description:
        "Empirical leeway coefficient depending on hull shape and keel.",
      id: "kFactor",
      kind: "number",
      label: "K factor",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Leeway angle between heading and track.",
      format: "angle",
      id: "leewayDeg",
      kind: "number",
      label: "Leeway angle",
      unit: "°",
    },
  ],
  title: "Leeway Angle Calculator",
});
export const runLeewayAngle = leewayAngleTool.execute;
export default leewayAngleTool;
