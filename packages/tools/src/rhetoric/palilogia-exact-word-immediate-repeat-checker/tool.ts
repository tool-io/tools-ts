import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch43-shared.js";

export type Input = Readonly<{ readonly lexicalTokens: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "lexicalTokens", label: "Lexical tokens", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.lexicalTokens.length || input.lexicalTokens.some((v) => !v.trim()))
    simpleError("tokens", "Explicit nonempty lexical tokens.");
  const starts: number[] = [],
    lengths: number[] = [];
  for (let i = 0; i < input.lexicalTokens.length;) {
    let end = i + 1;
    while (
      end < input.lexicalTokens.length &&
      input.lexicalTokens[end] === input.lexicalTokens[i]
    )
      end++;
    if (end - i >= 2) {
      starts.push(i);
      lengths.push(end - i);
    }
    i = end;
  }
  return { repeatedRunStartIndices: starts, repeatedRunLengths: lengths };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { lexicalTokens: ["go", "go", "go", "now"] },
  output: { result: { repeatedRunStartIndices: [0], repeatedRunLengths: [3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/palilogia-exact-word-immediate-repeat-checker",
  title: "Palilogia Exact Word Immediate Repeat Checker",
  description:
    "Count maximal immediate identical-token runs of at least2tokens, not inferred rhetorical intention; exact case/punctuation tokens.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
