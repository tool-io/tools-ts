import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyAnnotatedWordCount: number;
  readonly independentlyAnnotatedSentenceCount: number;
  readonly independentlyAnnotatedSyllableCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyAnnotatedWordCount",
    label: "Independently annotated word count",
    kind: "number",
  },
  {
    id: "independentlyAnnotatedSentenceCount",
    label: "Independently annotated sentence count",
    kind: "number",
  },
  {
    id: "independentlyAnnotatedSyllableCount",
    label: "Independently annotated syllable count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.independentlyAnnotatedWordCount, "words", 1, 1000000);
  bounded(
    input.independentlyAnnotatedSentenceCount,
    "sentences",
    1,
    input.independentlyAnnotatedWordCount,
  );
  bounded(
    input.independentlyAnnotatedSyllableCount,
    "syllables",
    input.independentlyAnnotatedWordCount,
    10000000,
  );
  return {
    conditionalFleschKincaidGrade:
      (0.39 * input.independentlyAnnotatedWordCount) /
        input.independentlyAnnotatedSentenceCount +
      (11.8 * input.independentlyAnnotatedSyllableCount) /
        input.independentlyAnnotatedWordCount -
      15.59,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyAnnotatedWordCount: 100,
    independentlyAnnotatedSentenceCount: 10,
    independentlyAnnotatedSyllableCount: 150,
  },
  output: { result: { conditionalFleschKincaidGrade: 6.010000000000002 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/label-reading-level-rater",
  title: "Label Reading Level Grade Text Complexity Rater",
  description:
    "Flesch-Kincaid Englishgrade arithmetic on independently annotated actual label counts, not parse syllables/sentences automatically or establish comprehension, accessibility or school suitability.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
