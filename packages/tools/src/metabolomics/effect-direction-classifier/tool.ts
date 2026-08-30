import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly log2FoldChanges: readonly number[];
  readonly minimumMagnitude: number;
}>;
export type Output = Readonly<{
  readonly directions: readonly string[];
  readonly changedCount: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.minimumMagnitude < 0)
    simpleError("minimumMagnitude", "Effect threshold must be nonnegative.");
  const directions = input.log2FoldChanges.map((v) =>
    Math.abs(v) < input.minimumMagnitude
      ? "unchanged"
      : v > 0
        ? "up"
        : v < 0
          ? "down"
          : "unchanged",
  );
  return {
    directions,
    changedCount: directions.filter((v) => v !== "unchanged").length,
  };
};
export const exampleInput = {
  log2FoldChanges: [-2, 0.5, 2],
  minimumMagnitude: 1,
} satisfies Input;
export const exampleOutput = {
  directions: ["down", "unchanged", "up"],
  changedCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/effect-direction-classifier",
  title: "Effect Direction Classifier",
  description:
    "Classify metabolite fold-change direction without significance claims.",
  inputs: [
    { id: "log2FoldChanges", kind: "numberList", label: "Log 2 fold changes" },
    { id: "minimumMagnitude", kind: "number", label: "Minimum magnitude" },
  ],
  outputs: [
    { id: "directions", kind: "stringList", label: "Directions" },
    { id: "changedCount", kind: "number", label: "Changed count" },
  ],
  calculate: (value) =>
    calculate({
      log2FoldChanges: value.log2FoldChanges as readonly number[],
      minimumMagnitude: value.minimumMagnitude as number,
    }),
});
export const run = tool.execute;
export default tool;
