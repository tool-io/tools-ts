import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  histogram,
  tokenInventory,
} from "../batch43-shared.js";

export type Input = Readonly<{ readonly clauses: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "clauses", label: "Clauses", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (input.clauses.length < 2)
    simpleError("clauses", "At least two caller delimited nonempty clauses.");
  const tokens = input.clauses.map((v) => {
      const words = tokenInventory(v);
      if (!words.length) simpleError("clause", "Nonempty clauses.");
      return words[0];
    }),
    h = histogram(tokens);
  return {
    repeatedTokens: h.tokens.filter((_, i) => h.counts[i] >= 2),
    repeatedTokenCounts: h.counts.filter((v) => v >= 2),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { clauses: ["we rise", "we work", "they wait"] },
  output: { result: { repeatedTokens: ["we"], repeatedTokenCounts: [2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/anaphora-initial-word-repetition-counter",
  title: "Anaphora Initial Word Repetition Counter",
  description:
    "Count exact case-sensitive whitespace-delimited firstword repetitions across caller clauses, not semantic equivalence or proof of intended rhetorical effect.",
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
