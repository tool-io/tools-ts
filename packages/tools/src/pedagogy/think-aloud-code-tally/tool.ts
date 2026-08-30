import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly observedCodes: readonly string[];
  readonly categoryCodes: readonly string[];
}>;
export type Output = Readonly<{
  readonly categoryCounts: readonly number[];
  readonly uncodedCount: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    !input.categoryCodes.length ||
    new Set(input.categoryCodes).size !== input.categoryCodes.length
  )
    simpleError("categoryCodes", "Distinct think-aloud categories required.");
  const allowed = new Set(input.categoryCodes);
  return {
    categoryCounts: input.categoryCodes.map(
      (code) => input.observedCodes.filter((v) => v === code).length,
    ),
    uncodedCount: input.observedCodes.filter((v) => !allowed.has(v)).length,
  };
};
export const exampleInput = {
  observedCodes: ["question", "reason", "question", "uncoded"],
  categoryCodes: ["question", "reason"],
} satisfies Input;
export const exampleOutput = {
  categoryCounts: [2, 1],
  uncodedCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/think-aloud-code-tally",
  title: "Think Aloud Code Tally",
  description:
    "Tally think-aloud transcript categories and uncoded utterances.",
  inputs: [
    { id: "observedCodes", label: "Observed codes", kind: "stringList" },
    { id: "categoryCodes", label: "Category codes", kind: "stringList" },
  ],
  outputs: [
    { id: "categoryCounts", label: "Category counts", kind: "numberList" },
    { id: "uncodedCount", label: "Uncoded count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedCodes: value.observedCodes as readonly string[],
      categoryCodes: value.categoryCodes as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
