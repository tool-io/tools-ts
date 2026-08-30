import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly lapTimesSeconds: readonly number[];
  readonly strokeCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly lapSwolfScores: readonly number[];
  readonly meanSwolf: number;
}>;
export const calculate = (input: Input): Output => {
  const n = input.lapTimesSeconds.length;
  if (
    !n ||
    n !== input.strokeCounts.length ||
    input.lapTimesSeconds.some((v) => v <= 0) ||
    input.strokeCounts.some((v) => !Number.isSafeInteger(v) || v < 0)
  )
    simpleError(
      "strokeCounts",
      "Aligned positive lap times and whole-number strokes required.",
    );
  const lapSwolfScores = input.lapTimesSeconds.map(
    (v, i) => v + input.strokeCounts[i],
  );
  return {
    lapSwolfScores,
    meanSwolf: lapSwolfScores.reduce((a, b) => a + b, 0) / n,
  };
};
export const exampleInput = {
  lapTimesSeconds: [30, 32],
  strokeCounts: [20, 18],
} satisfies Input;
export const exampleOutput = {
  lapSwolfScores: [50, 50],
  meanSwolf: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/swim-golf-score",
  title: "Swim Golf Score",
  description:
    "Compute per-lap SWOLF from seconds plus strokes, for like-for-like lap distances.",
  inputs: [
    { id: "lapTimesSeconds", label: "Lap times seconds", kind: "numberList" },
    { id: "strokeCounts", label: "Stroke counts", kind: "numberList" },
  ],
  outputs: [
    { id: "lapSwolfScores", label: "Lap swolf scores", kind: "numberList" },
    { id: "meanSwolf", label: "Mean swolf", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      lapTimesSeconds: value.lapTimesSeconds as readonly number[],
      strokeCounts: value.strokeCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
