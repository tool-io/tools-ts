import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type StallSpeedBankInput = {
  readonly bankAngleDeg: number;
  readonly levelStallSpeedKt: number;
};

export type StallSpeedBankOutput = {
  readonly stallSpeedKt: number;
};

export const stallSpeedBankExample = {
  input: { bankAngleDeg: 60, levelStallSpeedKt: 50 },
  output: { stallSpeedKt: 70.7106781187 },
} satisfies ToolExample<StallSpeedBankInput, StallSpeedBankOutput>;

export const calculateStallSpeedInBank = (
  input: StallSpeedBankInput,
): StallSpeedBankOutput => {
  const radians = (input.bankAngleDeg * Math.PI) / 180;
  const cosine = Math.cos(radians);
  if (cosine <= 1e-12)
    simpleError(
      "bankAngleDeg",
      "Stall speed is undefined at a ninety degree bank.",
      "undefined_stall_speed",
    );
  return {
    stallSpeedKt: roundStatistic(input.levelStallSpeedKt / Math.sqrt(cosine)),
  };
};

export const stallSpeedBankTool = createSimpleTool({
  calculate: (input) =>
    calculateStallSpeedInBank(input as unknown as StallSpeedBankInput),
  description:
    "Compute the increased stall speed in a level turn from the bank angle.",
  id: "aviation/stall-speed-bank",
  inputs: [
    {
      description: "Level-flight stall speed.",
      id: "levelStallSpeedKt",
      kind: "number",
      label: "Level stall speed",
      unit: "kt",
    },
    {
      description: "Bank angle of the coordinated turn.",
      id: "bankAngleDeg",
      kind: "number",
      label: "Bank angle",
      unit: "°",
    },
  ],
  outputs: [
    {
      description: "Stall speed at the given bank.",
      format: "speed",
      id: "stallSpeedKt",
      kind: "number",
      label: "Stall speed",
      unit: "kt",
    },
  ],
  title: "Stall Speed in Bank Calculator",
});
export const runStallSpeedInBank = stallSpeedBankTool.execute;
export default stallSpeedBankTool;
