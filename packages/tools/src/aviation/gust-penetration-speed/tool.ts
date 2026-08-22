import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GustPenetrationSpeedInput = {
  readonly stallingSpeedKt: number;
};

export type GustPenetrationSpeedOutput = {
  readonly gustPenetrationSpeedKt: number;
};

const GUST_PENETRATION_TO_STALL_RATIO = 1.9;

export const gustPenetrationSpeedExample = {
  input: { stallingSpeedKt: 100 },
  output: { gustPenetrationSpeedKt: 190 },
} satisfies ToolExample<GustPenetrationSpeedInput, GustPenetrationSpeedOutput>;

export const calculateGustPenetrationSpeed = (
  input: GustPenetrationSpeedInput,
): GustPenetrationSpeedOutput => {
  if (input.stallingSpeedKt <= 0)
    simpleError(
      "stallingSpeedKt",
      "The stalling speed must be greater than zero.",
      "invalid_stalling_speed",
    );
  return {
    gustPenetrationSpeedKt:
      input.stallingSpeedKt * GUST_PENETRATION_TO_STALL_RATIO,
  };
};

export const gustPenetrationSpeedTool = createSimpleTool({
  calculate: (input) =>
    calculateGustPenetrationSpeed(
      input as unknown as GustPenetrationSpeedInput,
    ),
  description:
    "Estimate the rough-air penetration speed as 1.9 times the stalling speed.",
  id: "aviation/gust-penetration-speed",
  inputs: [
    {
      description: "Stalling speed in the current configuration.",
      id: "stallingSpeedKt",
      kind: "number",
      label: "Stalling speed",
      minimum: 0,
      unit: "kt",
    },
  ],
  outputs: [
    {
      description:
        "Estimated penetration speed for turbulent air, below the maneuvering envelope.",
      format: "speed",
      id: "gustPenetrationSpeedKt",
      kind: "number",
      label: "Penetration speed",
      unit: "kt",
    },
  ],
  title: "Gust Penetration Speed Calculator",
});
export const runGustPenetrationSpeed = gustPenetrationSpeedTool.execute;
export default gustPenetrationSpeedTool;
