import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly concept: string;
  readonly mechanisms: readonly string[];
}>;
export type Output = Readonly<{
  readonly questions: readonly string[];
  readonly questionCount: number;
}>;
export const calculate = (input: Input): Output => {
  const concept = input.concept.trim();
  if (!concept || input.mechanisms.some((v) => !v.trim()))
    simpleError("concept", "A concept and nonempty mechanisms are required.");
  const questions = [...new Set(input.mechanisms.map((v) => v.trim()))].map(
    (v) => `Why does ${v} affect ${concept}?`,
  );
  return { questions, questionCount: questions.length };
};
export const exampleInput = {
  concept: "evaporation",
  mechanisms: ["heat", "wind"],
} satisfies Input;
export const exampleOutput = {
  questions: [
    "Why does heat affect evaporation?",
    "Why does wind affect evaporation?",
  ],
  questionCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/elaborative-question-builder",
  title: "Elaborative Question Builder",
  description:
    "Turn caller-supplied causal mechanisms into elaborative why-questions.",
  inputs: [
    { id: "concept", label: "Concept", kind: "string" },
    { id: "mechanisms", label: "Mechanisms", kind: "stringList" },
  ],
  outputs: [
    { id: "questions", label: "Questions", kind: "stringList" },
    { id: "questionCount", label: "Question count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      concept: value.concept as string,
      mechanisms: value.mechanisms as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
