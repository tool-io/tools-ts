import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly options: readonly string[];
  readonly correctOptionIndex: number;
  readonly minimumOptionLength: number;
}>;
export type Output = Readonly<{
  readonly duplicateDistractorIndexes: readonly number[];
  readonly shortDistractorIndexes: readonly number[];
  readonly structurallyValid: boolean;
}>;
export const calculate = (input: Input): Output => {
  const options = input.options,
    n = options.length;
  if (
    n < 2 ||
    !Number.isSafeInteger(input.correctOptionIndex) ||
    input.correctOptionIndex < 0 ||
    input.correctOptionIndex >= n ||
    input.minimumOptionLength < 1
  )
    simpleError(
      "options",
      "At least two answer options, valid key, and minimum length required.",
    );
  const key = options[input.correctOptionIndex].trim().toLowerCase(),
    seen = new Set([key]),
    duplicateDistractorIndexes: number[] = [],
    shortDistractorIndexes: number[] = [];
  for (let i = 0; i < n; i++) {
    const value = options[i].trim().toLowerCase();
    if (i === input.correctOptionIndex) continue;
    if (seen.has(value)) duplicateDistractorIndexes.push(i);
    seen.add(value);
    if (value.length < input.minimumOptionLength)
      shortDistractorIndexes.push(i);
  }
  return {
    duplicateDistractorIndexes,
    shortDistractorIndexes,
    structurallyValid:
      duplicateDistractorIndexes.length === 0 &&
      shortDistractorIndexes.length === 0 &&
      key.length >= input.minimumOptionLength,
  };
};
export const exampleInput = {
  options: ["blue", "green", "red", "blue"],
  correctOptionIndex: 1,
  minimumOptionLength: 3,
} satisfies Input;
export const exampleOutput = {
  duplicateDistractorIndexes: [3],
  shortDistractorIndexes: [],
  structurallyValid: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/mcq-distractor-audit",
  title: "MCQ Distractor Audit",
  description:
    "Audit MCQ distractors for duplicates and caller-defined minimum length.",
  inputs: [
    { id: "options", label: "Options", kind: "stringList" },
    { id: "correctOptionIndex", label: "Correct option index", kind: "number" },
    {
      id: "minimumOptionLength",
      label: "Minimum option length",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "duplicateDistractorIndexes",
      label: "Duplicate distractor indexes",
      kind: "numberList",
    },
    {
      id: "shortDistractorIndexes",
      label: "Short distractor indexes",
      kind: "numberList",
    },
    { id: "structurallyValid", label: "Structurally valid", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      options: value.options as readonly string[],
      correctOptionIndex: value.correctOptionIndex as number,
      minimumOptionLength: value.minimumOptionLength as number,
    }),
});
export const run = tool.execute;
export default tool;
