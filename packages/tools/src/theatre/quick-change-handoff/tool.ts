import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly availableChangeSeconds: number;
  readonly dresserTaskSeconds: readonly number[];
  readonly handoffOverlapSeconds: number;
  readonly bufferSeconds: number;
}>;
export type Output = Readonly<{
  readonly serialTaskSeconds: number;
  readonly netChangeSeconds: number;
  readonly timeMarginSeconds: number;
  readonly feasible: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.dresserTaskSeconds.some((value) => value < 0))
    simpleError(
      "dresserTaskSeconds",
      "Task times must be nonnegative.",
      "invalid_tasks",
    );
  const serialTaskSeconds = input.dresserTaskSeconds.reduce((a, b) => a + b, 0);
  const netChangeSeconds = Math.max(
    0,
    serialTaskSeconds - input.handoffOverlapSeconds,
  );
  const timeMarginSeconds =
    input.availableChangeSeconds - netChangeSeconds - input.bufferSeconds;
  return {
    serialTaskSeconds,
    netChangeSeconds,
    timeMarginSeconds,
    feasible: timeMarginSeconds >= 0,
  };
};

export const exampleInput = {
  availableChangeSeconds: 60,
  dresserTaskSeconds: [20, 25, 15],
  handoffOverlapSeconds: 10,
  bufferSeconds: 5,
} satisfies Input;
export const exampleOutput = {
  serialTaskSeconds: 60,
  netChangeSeconds: 50,
  timeMarginSeconds: 5,
  feasible: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      availableChangeSeconds: input.availableChangeSeconds as number,
      dresserTaskSeconds: input.dresserTaskSeconds as readonly number[],
      handoffOverlapSeconds: input.handoffOverlapSeconds as number,
      bufferSeconds: input.bufferSeconds as number,
    }),
  description:
    "Budget a quick-change handoff with task overlap and required buffer.",
  id: "theatre/quick-change-handoff",
  inputs: [
    {
      id: "availableChangeSeconds",
      label: "Available quick-change time",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "dresserTaskSeconds",
      label: "Dresser task times",
      kind: "numberList",
      unit: "s",
    },
    {
      id: "handoffOverlapSeconds",
      label: "Parallel handoff overlap",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "bufferSeconds",
      label: "Required buffer",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
  ],
  outputs: [
    {
      id: "serialTaskSeconds",
      label: "Serial task time",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "netChangeSeconds",
      label: "Net quick-change time",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "timeMarginSeconds",
      label: "Time margin",
      kind: "number",
      unit: "s",
    },
    { id: "feasible", label: "Quick change is feasible", kind: "boolean" },
  ],
  title: "Quick-Change Handoff",
});

export const run = tool.execute;
export default tool;
