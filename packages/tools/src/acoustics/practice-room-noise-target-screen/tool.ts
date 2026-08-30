import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly instrumentFamily: string;
  readonly measuredRoomCriterion: number;
  readonly targetMaximumRoomCriterion: number;
}>;
export type Output = Readonly<{
  readonly instrumentFamily: string;
  readonly marginToTarget: number;
  readonly withinCallerTarget: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.instrumentFamily.trim().length === 0)
    simpleError(
      "instrumentFamily",
      "Instrument family must not be empty.",
      "empty_instrument_family",
    );
  if (
    !Number.isFinite(input.measuredRoomCriterion) ||
    !Number.isFinite(input.targetMaximumRoomCriterion) ||
    input.measuredRoomCriterion < 0 ||
    input.targetMaximumRoomCriterion < 0
  )
    simpleError(
      "measuredRoomCriterion",
      "RC values must be finite and nonnegative.",
      "invalid_rc",
    );
  const marginToTarget =
    input.targetMaximumRoomCriterion - input.measuredRoomCriterion;
  if (!Number.isFinite(marginToTarget))
    simpleError(
      "measuredRoomCriterion",
      "RC margin is out of range.",
      "numeric_overflow",
    );
  return {
    instrumentFamily: input.instrumentFamily,
    marginToTarget,
    withinCallerTarget: marginToTarget >= 0,
  };
};

export const example = {
  input: {
    instrumentFamily: "strings",
    measuredRoomCriterion: 20,
    targetMaximumRoomCriterion: 25,
  },
  output: {
    instrumentFamily: "strings",
    marginToTarget: 5,
    withinCallerTarget: true,
  },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: {
    instrumentFamily: "percussion",
    measuredRoomCriterion: 30,
    targetMaximumRoomCriterion: 25,
  },
  output: {
    instrumentFamily: "percussion",
    marginToTarget: -5,
    withinCallerTarget: false,
  },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      instrumentFamily: input.instrumentFamily as string,
      measuredRoomCriterion: input.measuredRoomCriterion as number,
      targetMaximumRoomCriterion: input.targetMaximumRoomCriterion as number,
    }),
  description:
    "Compare a measured room-criterion value with an explicit caller target while preserving the caller’s instrument-family label.",
  id: "acoustics/practice-room-noise-target-screen",
  inputs: [
    { id: "instrumentFamily", kind: "string", label: "Instrument family" },
    {
      id: "measuredRoomCriterion",
      kind: "number",
      label: "Measured RC",
      minimum: 0,
    },
    {
      id: "targetMaximumRoomCriterion",
      kind: "number",
      label: "Caller target maximum RC",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "instrumentFamily", kind: "string", label: "Instrument family" },
    { id: "marginToTarget", kind: "number", label: "Margin to target" },
    {
      id: "withinCallerTarget",
      kind: "boolean",
      label: "Within caller target",
    },
  ],
  title: "Practice-Room Noise Target Screen",
});

export const run = tool.execute;
export default tool;
