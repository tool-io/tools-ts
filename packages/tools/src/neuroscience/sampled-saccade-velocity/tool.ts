import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, ordered } from "../shared.js";
export type Input = Readonly<{
  readonly timesMs: readonly number[];
  readonly horizontalDegrees: readonly number[];
  readonly verticalDegrees: readonly number[];
}>;
export type Output = Readonly<{
  readonly intervalSpeedsDegreesPerSecond: readonly number[];
  readonly peakSpeedDegreesPerSecond: number;
  readonly totalPathDegrees: number;
}>;
const inputFields = [
  { id: "timesMs", label: "Times ms", kind: "numberList" },
  { id: "horizontalDegrees", label: "Horizontal degrees", kind: "numberList" },
  { id: "verticalDegrees", label: "Vertical degrees", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.timesMs, input.horizontalDegrees, "timesMs");
  aligned(input.timesMs, input.verticalDegrees, "timesMs");
  ordered(input.timesMs, "timesMs");
  const lengths = input.timesMs
      .slice(1)
      .map((_, i) =>
        Math.hypot(
          input.horizontalDegrees[i + 1] - input.horizontalDegrees[i],
          input.verticalDegrees[i + 1] - input.verticalDegrees[i],
        ),
      ),
    intervalSpeedsDegreesPerSecond = lengths.map(
      (v, i) => (v * 1000) / (input.timesMs[i + 1] - input.timesMs[i]),
    );
  return {
    intervalSpeedsDegreesPerSecond,
    peakSpeedDegreesPerSecond: Math.max(...intervalSpeedsDegreesPerSecond),
    totalPathDegrees: lengths.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesMs: [0, 10, 20],
  horizontalDegrees: [0, 1, 3],
  verticalDegrees: [0, 0, 0],
} satisfies Input;
export const exampleOutput = {
  intervalSpeedsDegreesPerSecond: [100, 200],
  peakSpeedDegreesPerSecond: 200,
  totalPathDegrees: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/sampled-saccade-velocity",
  title: "Saccade Velocity",
  description:
    "Derive planar eye-path speeds from timestamped horizontal/vertical angles; finite-difference peaks are cadence-limited and not instantaneous physiological peaks.",
  inputs: inputFields,
  outputs: [
    {
      id: "intervalSpeedsDegreesPerSecond",
      label: "Interval speeds degrees per second",
      kind: "numberList",
    },
    {
      id: "peakSpeedDegreesPerSecond",
      label: "Peak speed degrees per second",
      kind: "number",
    },
    { id: "totalPathDegrees", label: "Total path degrees", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      timesMs: value.timesMs as readonly number[],
      horizontalDegrees: value.horizontalDegrees as readonly number[],
      verticalDegrees: value.verticalDegrees as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
