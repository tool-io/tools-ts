import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  simpleError,
  type SimpleField,
} from "../../core/simple.js";
import {
  validateRandomInput,
  finish,
  sourceFor,
  indices,
  unique,
} from "../batch42-shared.js";

export type Input = Readonly<{
  readonly seed: string;
  readonly count: number;
  readonly candidateWords: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const inputFields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
  { id: "candidateWords", label: "Candidate words", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext): Output => {
  const random = sourceFor(input.seed, context);
  unique(input.candidateWords, "words");
  input.candidateWords.forEach((v) => {
    if (!/^[A-Za-z]{2,32}$/.test(v))
      simpleError(
        "words",
        "2–32ASCIIletters per caller word; puzzle permutations may retain the original word.",
      );
  });
  const chosen = indices(
    input.candidateWords.length,
    { ...input, withoutReplacement: false },
    random,
  );
  const puzzles = chosen.map((i) => {
    const word = input.candidateWords[i],
      letters = Array.from(word),
      order = indices(
        letters.length,
        { seed: input.seed, count: letters.length, withoutReplacement: true },
        random,
      );
    return {
      scrambled: order.map((i) => letters[i]).join(""),
      answer: word,
      unchanged: order.map((i) => letters[i]).join("") === word,
    };
  });
  return { result: { puzzles } };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateRandomInput(input, inputFields);
  return finish(compute(input, context));
};
export const example = {
  input: { seed: "tool.io/batch42", count: 1, candidateWords: ["cat", "dog"] },
} satisfies ToolExample<Input>;
export const tool = createSimpleTool({
  id: "random/anagram-puzzle",
  title: "Random Anagram Puzzle Generator",
  description:
    "Uniform caller word selection and uniform letter-position permutations; repeated letters and identity permutations allowed rather than retry-biased scrambling. ASCII spelling drill, not language validity or a guaranteed different anagram.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
