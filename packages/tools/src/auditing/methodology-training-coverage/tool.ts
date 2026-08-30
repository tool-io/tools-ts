import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly assignedLearners: number;
  readonly completedLearners: number;
  readonly minimumCompletionPercent: number;
}>;
export type Output = Readonly<{
  readonly completionPercent: number;
  readonly outstandingLearners: number;
  readonly meetsMinimum: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.assignedLearners <= 0 ||
    input.completedLearners > input.assignedLearners
  )
    simpleError(
      "assignedLearners",
      "Assigned learners must be positive and at least completed learners.",
      "invalid_counts",
    );
  const completionPercent =
    (input.completedLearners / input.assignedLearners) * 100;
  return {
    completionPercent,
    outstandingLearners: input.assignedLearners - input.completedLearners,
    meetsMinimum: completionPercent >= input.minimumCompletionPercent,
  };
};

export const exampleInput = {
  assignedLearners: 100,
  completedLearners: 95,
  minimumCompletionPercent: 90,
} satisfies Input;
export const exampleOutput = {
  completionPercent: 95,
  outstandingLearners: 5,
  meetsMinimum: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      assignedLearners: input.assignedLearners as number,
      completedLearners: input.completedLearners as number,
      minimumCompletionPercent: input.minimumCompletionPercent as number,
    }),
  description: "Measure annual methodology training completion.",
  id: "auditing/methodology-training-coverage",
  inputs: [
    {
      id: "assignedLearners",
      label: "Assigned learners",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "completedLearners",
      label: "Completed learners",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "minimumCompletionPercent",
      label: "Minimum completion",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "completionPercent",
      label: "Completion percentage",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "outstandingLearners",
      label: "Outstanding learners",
      kind: "integer",
      minimum: 0,
    },
    { id: "meetsMinimum", label: "Meets supplied minimum", kind: "boolean" },
  ],
  title: "Methodology Training Coverage",
});

export const run = tool.execute;
export default tool;
