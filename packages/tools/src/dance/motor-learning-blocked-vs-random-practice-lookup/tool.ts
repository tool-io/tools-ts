import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded, safeText } from "../batch33-shared.js";
export type Input = Readonly<{
  readonly observedPracticeTaskIds: readonly string[];
  readonly callerMaximumSameTaskBlockLength: number;
}>;
export type Output = Readonly<{
  readonly observedSameTaskBlockLengths: readonly number[];
  readonly observedTaskSwitchCount: number;
  readonly blocksAboveCallerPracticePolicyIndices: readonly number[];
  readonly adjacentTaskSwitchFraction: number;
}>;
const inputFields = [
  {
    id: "observedPracticeTaskIds",
    label: "Observed practice task ids",
    kind: "stringList",
  },
  {
    id: "callerMaximumSameTaskBlockLength",
    label: "Caller maximum same task block length",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.observedPracticeTaskIds.length < 2)
    simpleError("practice", "At least two actual practice trials required.");
  input.observedPracticeTaskIds.forEach((v) => safeText(v, "task"));
  bounded(input.callerMaximumSameTaskBlockLength, "block", 1, 128);
  const blocks: number[] = [];
  input.observedPracticeTaskIds.forEach((v, i) => {
    if (!i || v !== input.observedPracticeTaskIds[i - 1]) blocks.push(1);
    else blocks[blocks.length - 1]++;
  });
  return {
    observedSameTaskBlockLengths: blocks,
    observedTaskSwitchCount: blocks.length - 1,
    blocksAboveCallerPracticePolicyIndices: blocks.flatMap((v, i) =>
      v > input.callerMaximumSameTaskBlockLength ? [i] : [],
    ),
    adjacentTaskSwitchFraction:
      (blocks.length - 1) / (input.observedPracticeTaskIds.length - 1),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPracticeTaskIds: ["A", "A", "B", "B", "A"],
  callerMaximumSameTaskBlockLength: 2,
} satisfies Input;
export const exampleOutput = {
  observedSameTaskBlockLengths: [2, 2, 1],
  observedTaskSwitchCount: 2,
  blocksAboveCallerPracticePolicyIndices: [],
  adjacentTaskSwitchFraction: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/motor-learning-blocked-vs-random-practice-lookup",
  title: "Motor Learning Blocked vs Random Practice Lookup",
  description:
    "Audit actual practice task-switch/block structure under caller maximum block policy; switching alone does not prove randomness, optimal motor learning, transfer or retention.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedSameTaskBlockLengths",
      label: "Observed same task block lengths",
      kind: "numberList",
    },
    {
      id: "observedTaskSwitchCount",
      label: "Observed task switch count",
      kind: "number",
    },
    {
      id: "blocksAboveCallerPracticePolicyIndices",
      label: "Blocks above caller practice policy indices",
      kind: "numberList",
    },
    {
      id: "adjacentTaskSwitchFraction",
      label: "Adjacent task switch fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPracticeTaskIds:
        value.observedPracticeTaskIds as readonly string[],
      callerMaximumSameTaskBlockLength:
        value.callerMaximumSameTaskBlockLength as number,
    }),
});
export const run = tool.execute;
export default tool;
