import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly soundArrivalMilliseconds: number;
  readonly visualArrivalMilliseconds: number;
  readonly targetSoundOffsetMilliseconds: number;
}>;
export type Output = Readonly<{
  readonly observedSoundOffsetMilliseconds: number;
  readonly requiredSoundDelayAdjustmentMilliseconds: number;
}>;

export const calculate = (input: Input): Output => {
  const observedSoundOffsetMilliseconds =
    input.soundArrivalMilliseconds - input.visualArrivalMilliseconds;
  return {
    observedSoundOffsetMilliseconds,
    requiredSoundDelayAdjustmentMilliseconds:
      input.targetSoundOffsetMilliseconds - observedSoundOffsetMilliseconds,
  };
};

export const exampleInput = {
  soundArrivalMilliseconds: 42,
  visualArrivalMilliseconds: 20,
  targetSoundOffsetMilliseconds: 0,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  soundArrivalMilliseconds: 20,
  visualArrivalMilliseconds: 20,
  targetSoundOffsetMilliseconds: 10,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      soundArrivalMilliseconds: input.soundArrivalMilliseconds as number,
      visualArrivalMilliseconds: input.visualArrivalMilliseconds as number,
      targetSoundOffsetMilliseconds:
        input.targetSoundOffsetMilliseconds as number,
    }),
  description:
    "Calculate the sound-delay adjustment needed to reach a caller-defined audiovisual offset.",
  id: "theatre/stage-sound-sync-delay",
  inputs: [
    {
      id: "soundArrivalMilliseconds",
      label: "Sound arrival time",
      kind: "number",
      unit: "ms",
    },
    {
      id: "visualArrivalMilliseconds",
      label: "Visual arrival time",
      kind: "number",
      unit: "ms",
    },
    {
      id: "targetSoundOffsetMilliseconds",
      label: "Target sound offset",
      kind: "number",
      unit: "ms",
    },
  ],
  outputs: [
    {
      id: "observedSoundOffsetMilliseconds",
      label: "Observed sound offset",
      kind: "number",
      unit: "ms",
    },
    {
      id: "requiredSoundDelayAdjustmentMilliseconds",
      label: "Required sound-delay adjustment",
      kind: "number",
      unit: "ms",
    },
  ],
  title: "Stage Sound Sync Delay",
});

export const run = tool.execute;
export default tool;
