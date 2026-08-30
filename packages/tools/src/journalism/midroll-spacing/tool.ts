import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly midrollTimesSeconds: readonly number[];
  readonly minimumSpacingSeconds: number;
}>;
export type Output = Readonly<{
  readonly minimumObservedSpacingSeconds: number;
  readonly violatingPositions: readonly number[];
  readonly violationCount: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.midrollTimesSeconds.length < 2 ||
    input.midrollTimesSeconds.some(
      (value, index) =>
        value < 0 ||
        (index > 0 && value <= input.midrollTimesSeconds[index - 1]),
    )
  )
    simpleError(
      "midrollTimesSeconds",
      "At least two increasing nonnegative timestamps are required.",
      "invalid_timestamps",
    );
  const gaps = input.midrollTimesSeconds
    .slice(1)
    .map((value, index) => value - input.midrollTimesSeconds[index]);
  const violatingPositions = gaps
    .map((gap, index) => (gap < input.minimumSpacingSeconds ? index + 2 : 0))
    .filter(Boolean);
  return {
    minimumObservedSpacingSeconds: Math.min(...gaps),
    violatingPositions,
    violationCount: violatingPositions.length,
  };
};

export const exampleInput = {
  midrollTimesSeconds: [60, 180, 250],
  minimumSpacingSeconds: 90,
} satisfies Input;
export const exampleOutput = {
  minimumObservedSpacingSeconds: 70,
  violatingPositions: [3],
  violationCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      midrollTimesSeconds: input.midrollTimesSeconds as readonly number[],
      minimumSpacingSeconds: input.minimumSpacingSeconds as number,
    }),
  description:
    "Find podcast midroll placements that violate a supplied spacing minimum.",
  id: "journalism/midroll-spacing",
  inputs: [
    {
      id: "midrollTimesSeconds",
      label: "Midroll timestamps",
      kind: "numberList",
      unit: "s",
    },
    {
      id: "minimumSpacingSeconds",
      label: "Minimum spacing",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
  ],
  outputs: [
    {
      id: "minimumObservedSpacingSeconds",
      label: "Minimum observed spacing",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "violatingPositions",
      label: "One-based positions after short gaps",
      kind: "numberList",
    },
    {
      id: "violationCount",
      label: "Spacing violations",
      kind: "integer",
      minimum: 0,
    },
  ],
  title: "Midroll Spacing",
});

export const run = tool.execute;
export default tool;
