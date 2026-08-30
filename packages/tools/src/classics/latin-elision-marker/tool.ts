import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly text: string;
}>;
export type Output = Readonly<{
  readonly elisionPairs: readonly string[];
  readonly candidateCount: number;
}>;

export const calculate = (input: Input): Output => {
  const words = input.text.trim().split(/\s+/u).filter(Boolean);
  if (words.length === 0)
    simpleError("text", "Text must not be empty.", "empty_text");
  const elisionPairs: string[] = [];
  for (let index = 0; index + 1 < words.length; index += 1)
    if (
      /[aeiouy]m?$/iu.test(words[index]) &&
      /^[h]?[aeiouy]/iu.test(words[index + 1])
    )
      elisionPairs.push(`${words[index]} ${words[index + 1]}`);
  return { elisionPairs, candidateCount: elisionPairs.length };
};

export const exampleInput = { text: "multum ille et terris" } satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = { text: "arma virumque cano" } satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      text: input.text as string,
    }),
  description:
    "Find mechanical Latin vowel-contact candidates; poetic elision still requires scansion.",
  id: "classics/latin-elision-marker",
  inputs: [{ id: "text", label: "Latin verse text", kind: "string" }],
  outputs: [
    { id: "elisionPairs", label: "Candidate word pairs", kind: "stringList" },
    {
      id: "candidateCount",
      label: "Candidate count",
      kind: "integer",
      minimum: 0,
    },
  ],
  title: "Latin Elision Marker",
});

export const run = tool.execute;
export default tool;
