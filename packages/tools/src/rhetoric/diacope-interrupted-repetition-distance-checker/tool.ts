import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch43-shared.js";

export type Input = Readonly<{ readonly lexicalTokens: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "lexicalTokens", label: "Lexical tokens", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    input.lexicalTokens.length > 64 ||
    !input.lexicalTokens.length ||
    input.lexicalTokens.some((v) => !v.trim())
  )
    simpleError("tokens", "1–64explicit lexical tokens.");
  const pairs: number[][] = [],
    gaps: number[] = [];
  for (let a = 0; a < input.lexicalTokens.length; a++)
    for (let b = a + 2; b < input.lexicalTokens.length; b++)
      if (input.lexicalTokens[a] === input.lexicalTokens[b]) {
        pairs.push([a, b]);
        gaps.push(b - a - 1);
      }
  return { repeatedTokenPairs: pairs, interveningTokenCounts: gaps };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { lexicalTokens: ["go", "now", "go", "home", "go"] },
  output: {
    result: {
      repeatedTokenPairs: [
        [0, 2],
        [0, 4],
        [2, 4],
      ],
      interveningTokenCounts: [1, 3, 1],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/diacope-interrupted-repetition-distance-checker",
  title: "Diacope Interrupted Repetition Distance Checker",
  description:
    "Enumerate exact interrupted-token repetitions, retaining all nonadjacent pairs and actual intervening token counts, not infer diacope intent.",
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
