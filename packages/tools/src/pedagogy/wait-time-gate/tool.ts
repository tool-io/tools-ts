import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly observedWaitSeconds: readonly number[];
  readonly minimumWaitSeconds: number;
}>;
export type Output = Readonly<{
  readonly meetsMinimumCount: number;
  readonly belowMinimumIndexes: readonly number[];
  readonly meanWaitSeconds: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    !input.observedWaitSeconds.length ||
    input.observedWaitSeconds.some((v) => v < 0) ||
    input.minimumWaitSeconds < 0
  )
    simpleError(
      "observedWaitSeconds",
      "Nonnegative observed waits and a minimum required.",
    );
  return {
    meetsMinimumCount: input.observedWaitSeconds.filter(
      (v) => v >= input.minimumWaitSeconds,
    ).length,
    belowMinimumIndexes: input.observedWaitSeconds.flatMap((v, i) =>
      v < input.minimumWaitSeconds ? [i] : [],
    ),
    meanWaitSeconds:
      input.observedWaitSeconds.reduce((a, b) => a + b, 0) /
      input.observedWaitSeconds.length,
  };
};
export const exampleInput = {
  observedWaitSeconds: [2, 3, 5],
  minimumWaitSeconds: 3,
} satisfies Input;
export const exampleOutput = {
  meetsMinimumCount: 2,
  belowMinimumIndexes: [0],
  meanWaitSeconds: 3.3333333333333335,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/wait-time-gate",
  title: "Wait Time Gate",
  description: "Measure teacher wait times against a caller-supplied minimum.",
  inputs: [
    {
      id: "observedWaitSeconds",
      label: "Observed wait seconds",
      kind: "numberList",
    },
    { id: "minimumWaitSeconds", label: "Minimum wait seconds", kind: "number" },
  ],
  outputs: [
    { id: "meetsMinimumCount", label: "Meets minimum count", kind: "number" },
    {
      id: "belowMinimumIndexes",
      label: "Below minimum indexes",
      kind: "numberList",
    },
    { id: "meanWaitSeconds", label: "Mean wait seconds", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedWaitSeconds: value.observedWaitSeconds as readonly number[],
      minimumWaitSeconds: value.minimumWaitSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
