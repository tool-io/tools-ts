import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, mean, window } from "../shared.js";
export type Input = Readonly<{
  readonly timesSeconds: readonly number[];
  readonly signals: readonly number[];
  readonly baselineStartSeconds: number;
  readonly baselineEndSeconds: number;
  readonly taskStartSeconds: number;
  readonly taskEndSeconds: number;
}>;
export type Output = Readonly<{
  readonly baselineMean: number;
  readonly taskMean: number;
  readonly percentSignalChange: number;
}>;
const inputFields = [
  { id: "timesSeconds", label: "Times seconds", kind: "numberList" },
  { id: "signals", label: "Signals", kind: "numberList" },
  {
    id: "baselineStartSeconds",
    label: "Baseline start seconds",
    kind: "number",
  },
  { id: "baselineEndSeconds", label: "Baseline end seconds", kind: "number" },
  { id: "taskStartSeconds", label: "Task start seconds", kind: "number" },
  { id: "taskEndSeconds", label: "Task end seconds", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.baselineEndSeconds >= input.taskStartSeconds)
    simpleError(
      "taskStartSeconds",
      "Baseline must end before the task window starts.",
    );
  const baselineMean = positive(
      mean(
        window(
          input.timesSeconds,
          input.signals,
          input.baselineStartSeconds,
          input.baselineEndSeconds,
        ),
      ),
      "signals",
    ),
    taskMean = mean(
      window(
        input.timesSeconds,
        input.signals,
        input.taskStartSeconds,
        input.taskEndSeconds,
      ),
    );
  return {
    baselineMean,
    taskMean,
    percentSignalChange: (100 * (taskMean - baselineMean)) / baselineMean,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesSeconds: [0, 1, 2, 3],
  signals: [100, 100, 110, 110],
  baselineStartSeconds: 0,
  baselineEndSeconds: 1,
  taskStartSeconds: 2,
  taskEndSeconds: 3,
} satisfies Input;
export const exampleOutput = {
  baselineMean: 100,
  taskMean: 110,
  percentSignalChange: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/bold-baseline-task-change",
  title: "BOLD Percent Signal Change",
  description:
    "Compute BOLD percent signal change from explicit disjoint sampled baseline/task windows; motion, drift and hemodynamic modeling are not performed.",
  inputs: inputFields,
  outputs: [
    { id: "baselineMean", label: "Baseline mean", kind: "number" },
    { id: "taskMean", label: "Task mean", kind: "number" },
    {
      id: "percentSignalChange",
      label: "Percent signal change",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      timesSeconds: value.timesSeconds as readonly number[],
      signals: value.signals as readonly number[],
      baselineStartSeconds: value.baselineStartSeconds as number,
      baselineEndSeconds: value.baselineEndSeconds as number,
      taskStartSeconds: value.taskStartSeconds as number,
      taskEndSeconds: value.taskEndSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
