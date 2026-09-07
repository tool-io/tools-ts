import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  tokenInventory,
} from "../batch43-shared.js";

export type Input = Readonly<{ readonly clauses: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "clauses", label: "Clauses", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (input.clauses.length < 2)
    simpleError("clauses", "At least two explicit clauses.");
  const words = input.clauses.map(tokenInventory);
  if (words.some((v) => !v.length))
    simpleError("clauses", "Nonempty lexical clauses.");
  const a = words[0][0],
    b = words[0].at(-1)!;
  return {
    matchingFrameClauseIndices: words.flatMap((v, i) =>
      v[0] === a && v.at(-1) === b ? [i] : [],
    ),
    referenceFirstToken: a,
    referenceLastToken: b,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { clauses: ["we shall win", "we can win", "they can wait"] },
  output: {
    result: {
      matchingFrameClauseIndices: [0, 1],
      referenceFirstToken: "we",
      referenceLastToken: "win",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/symploce-beginning-end-combo-checker",
  title: "Symploce Beginning End Combo Checker",
  description:
    "Audit combined exact first/last lexical frame matching against the first caller clause; no automatic phrase-boundary or intention inference.",
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
