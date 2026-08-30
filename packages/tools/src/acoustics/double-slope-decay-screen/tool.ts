import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly earlyDecayDecibelsPerSecond: number;
  readonly lateDecayDecibelsPerSecond: number;
  readonly minimumFractionalChange: number;
}>;
export type Output = Readonly<{
  readonly fractionalRateChange: number;
  readonly lateToEarlyRateRatio: number;
  readonly doubleSlopeCandidate: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    !Number.isFinite(input.earlyDecayDecibelsPerSecond) ||
    input.earlyDecayDecibelsPerSecond <= 0 ||
    !Number.isFinite(input.lateDecayDecibelsPerSecond) ||
    input.lateDecayDecibelsPerSecond <= 0
  )
    simpleError(
      "earlyDecayDecibelsPerSecond",
      "Decay-rate magnitudes must be finite and positive.",
      "invalid_decay_rate",
    );
  if (
    !Number.isFinite(input.minimumFractionalChange) ||
    input.minimumFractionalChange < 0
  )
    simpleError(
      "minimumFractionalChange",
      "Threshold must be finite and nonnegative.",
      "invalid_threshold",
    );
  const lateToEarlyRateRatio =
    input.lateDecayDecibelsPerSecond / input.earlyDecayDecibelsPerSecond;
  if (!Number.isFinite(lateToEarlyRateRatio) || lateToEarlyRateRatio <= 0)
    simpleError(
      "lateDecayDecibelsPerSecond",
      "Decay-rate ratio is out of range.",
      "numeric_overflow",
    );
  const fractionalRateChange = Math.abs(lateToEarlyRateRatio - 1);
  return {
    fractionalRateChange,
    lateToEarlyRateRatio,
    doubleSlopeCandidate: fractionalRateChange >= input.minimumFractionalChange,
  };
};

export const example = {
  input: {
    earlyDecayDecibelsPerSecond: 30,
    lateDecayDecibelsPerSecond: 15,
    minimumFractionalChange: 0.25,
  },
  output: {
    fractionalRateChange: 0.5,
    lateToEarlyRateRatio: 0.5,
    doubleSlopeCandidate: true,
  },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: {
    earlyDecayDecibelsPerSecond: 20,
    lateDecayDecibelsPerSecond: 20,
    minimumFractionalChange: 0.1,
  },
  output: {
    fractionalRateChange: 0,
    lateToEarlyRateRatio: 1,
    doubleSlopeCandidate: false,
  },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      earlyDecayDecibelsPerSecond: input.earlyDecayDecibelsPerSecond as number,
      lateDecayDecibelsPerSecond: input.lateDecayDecibelsPerSecond as number,
      minimumFractionalChange: input.minimumFractionalChange as number,
    }),
  description:
    "Compare positive early and late decay-rate magnitudes against an explicit fractional-change threshold.",
  id: "acoustics/double-slope-decay-screen",
  inputs: [
    {
      id: "earlyDecayDecibelsPerSecond",
      kind: "number",
      label: "Early decay-rate magnitude",
      minimum: 0,
      unit: "dB/s",
    },
    {
      id: "lateDecayDecibelsPerSecond",
      kind: "number",
      label: "Late decay-rate magnitude",
      minimum: 0,
      unit: "dB/s",
    },
    {
      id: "minimumFractionalChange",
      kind: "number",
      label: "Minimum fractional change",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "fractionalRateChange",
      kind: "number",
      label: "Fractional rate change",
      minimum: 0,
    },
    {
      id: "lateToEarlyRateRatio",
      kind: "number",
      label: "Late-to-early rate ratio",
      minimum: 0,
    },
    {
      id: "doubleSlopeCandidate",
      kind: "boolean",
      label: "Double-slope candidate",
    },
  ],
  title: "Double-Slope Decay Screen",
});

export const run = tool.execute;
export default tool;
