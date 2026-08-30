import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { count, nonnegative, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly passageNumbers: readonly number[];
  readonly passageDays: readonly number[];
  readonly expectedIncrement: number;
}>;
export type Output = Readonly<{
  readonly invalidTransitionIndexes: readonly number[];
  readonly validSequence: boolean;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.passageNumbers, input.passageDays, "passageNumbers");
  count(input.expectedIncrement, "expectedIncrement", 1);
  input.passageNumbers.forEach((v) => count(v, "passageNumbers"));
  input.passageDays.forEach((v) => nonnegative(v, "passageDays"));
  const invalidTransitionIndexes = input.passageNumbers.flatMap((v, i) =>
    i > 0 &&
    (v - input.passageNumbers[i - 1] !== input.expectedIncrement ||
      input.passageDays[i] <= input.passageDays[i - 1])
      ? [i]
      : [],
  );
  return {
    invalidTransitionIndexes,
    validSequence: invalidTransitionIndexes.length === 0,
  };
};
export const exampleInput = {
  passageNumbers: [3, 4, 6],
  passageDays: [0, 2, 5],
  expectedIncrement: 1,
} satisfies Input;
export const exampleOutput = {
  invalidTransitionIndexes: [2],
  validSequence: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/culture-passage-sequence-audit",
  title: "Culture Passage Sequence Audit",
  description:
    "Audit culture-passage numbering and chronological order against a supplied increment.",
  inputs: [
    { id: "passageNumbers", label: "Passage numbers", kind: "numberList" },
    { id: "passageDays", label: "Passage days", kind: "numberList" },
    { id: "expectedIncrement", label: "Expected increment", kind: "integer" },
  ],
  outputs: [
    {
      id: "invalidTransitionIndexes",
      label: "Invalid transition indexes",
      kind: "numberList",
    },
    { id: "validSequence", label: "Valid sequence", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      passageNumbers: value.passageNumbers as readonly number[],
      passageDays: value.passageDays as readonly number[],
      expectedIncrement: value.expectedIncrement as number,
    }),
});
export const run = tool.execute;
export default tool;
