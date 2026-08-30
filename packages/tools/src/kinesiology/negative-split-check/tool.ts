import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly firstHalfSeconds: number;
  readonly secondHalfSeconds: number;
}>;
export type Output = Readonly<{
  readonly timeDifferenceSeconds: number;
  readonly negativeSplit: boolean;
  readonly improvementPercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.firstHalfSeconds <= 0 || input.secondHalfSeconds <= 0)
    simpleError(
      "firstHalfSeconds",
      "Split times must be positive.",
      "invalid_time",
    );
  const timeDifferenceSeconds =
    input.firstHalfSeconds - input.secondHalfSeconds;
  return {
    timeDifferenceSeconds,
    negativeSplit: timeDifferenceSeconds > 0,
    improvementPercent: (timeDifferenceSeconds / input.firstHalfSeconds) * 100,
  };
};

export const exampleInput = {
  firstHalfSeconds: 305,
  secondHalfSeconds: 295,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  firstHalfSeconds: 295,
  secondHalfSeconds: 305,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      firstHalfSeconds: input.firstHalfSeconds as number,
      secondHalfSeconds: input.secondHalfSeconds as number,
    }),
  description:
    "Determine whether the second half is faster and quantify the change.",
  id: "kinesiology/negative-split-check",
  inputs: [
    {
      id: "firstHalfSeconds",
      label: "First-half time",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "secondHalfSeconds",
      label: "Second-half time",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
  ],
  outputs: [
    {
      id: "timeDifferenceSeconds",
      label: "First minus second half",
      kind: "number",
      unit: "s",
    },
    { id: "negativeSplit", label: "Negative split", kind: "boolean" },
    {
      id: "improvementPercent",
      label: "Second-half improvement",
      kind: "number",
      unit: "%",
    },
  ],
  title: "Negative Split Check",
});

export const run = tool.execute;
export default tool;
