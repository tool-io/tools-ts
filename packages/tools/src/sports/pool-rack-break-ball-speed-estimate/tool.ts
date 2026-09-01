import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
  aligned,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedBallTravelDistancesMeters: readonly number[];
  readonly observedTravelVideoFrames: readonly number[];
  readonly callerVideoFramesPerSecond: number;
}>;
export type Output = Readonly<{
  readonly observedMeanBallSpeedsMetersSecond: readonly number[];
}>;
const inputFields = [
  {
    id: "observedBallTravelDistancesMeters",
    label: "Observed ball travel distances meters",
    kind: "numberList",
  },
  {
    id: "observedTravelVideoFrames",
    label: "Observed travel video frames",
    kind: "numberList",
  },
  {
    id: "callerVideoFramesPerSecond",
    label: "Caller video frames per second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerVideoFramesPerSecond, "callerVideoFramesPerSecond");
  input.observedBallTravelDistancesMeters.forEach((v) =>
    nonnegative(v, "observedBallTravelDistancesMeters"),
  );
  aligned(
    input.observedBallTravelDistancesMeters,
    input.observedTravelVideoFrames,
    "observedBallTravelDistancesMeters",
  );
  input.observedTravelVideoFrames.forEach((v) =>
    bounded(v, "frames", 1, 1000000),
  );
  return {
    observedMeanBallSpeedsMetersSecond:
      input.observedBallTravelDistancesMeters.map(
        (v, i) =>
          (v * input.callerVideoFramesPerSecond) /
          input.observedTravelVideoFrames[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBallTravelDistancesMeters: [1, 2],
  observedTravelVideoFrames: [10, 20],
  callerVideoFramesPerSecond: 240,
} satisfies Input;
export const exampleOutput = {
  observedMeanBallSpeedsMetersSecond: [24, 24],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/pool-rack-break-ball-speed-estimate",
  title: "Break Shot Ball Speed Estimate",
  description:
    "Estimate actual video-window mean pool-break ball travel speed, not instantaneous cue-impact speed, frame interpolation or experimental striking instructions.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedMeanBallSpeedsMetersSecond",
      label: "Observed mean ball speeds meters second",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBallTravelDistancesMeters:
        value.observedBallTravelDistancesMeters as readonly number[],
      observedTravelVideoFrames:
        value.observedTravelVideoFrames as readonly number[],
      callerVideoFramesPerSecond: value.callerVideoFramesPerSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
