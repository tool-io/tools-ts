import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type Input = Readonly<{
  readonly questionStem: string;
}>;
export type Output = Readonly<{
  readonly negativeTerms: readonly string[];
  readonly hasNegativeStem: boolean;
}>;
export const calculate = (input: Input): Output => {
  const negativeTerms = [
    ...input.questionStem.matchAll(/\b(?:not|except|never|least)\b/giu),
  ].map((match) => match[0].toUpperCase());
  return { negativeTerms, hasNegativeStem: negativeTerms.length > 0 };
};
export const exampleInput = {
  questionStem: "Which option is NOT correct?",
} satisfies Input;
export const exampleOutput = {
  negativeTerms: ["NOT"],
  hasNegativeStem: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/negative-question-stem-screen",
  title: "Negative Question Stem Screen",
  description: "Flag negative terms in multiple-choice question stems.",
  inputs: [{ id: "questionStem", label: "Question stem", kind: "string" }],
  outputs: [
    { id: "negativeTerms", label: "Negative terms", kind: "stringList" },
    { id: "hasNegativeStem", label: "Has negative stem", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      questionStem: value.questionStem as string,
    }),
});
export const run = tool.execute;
export default tool;
