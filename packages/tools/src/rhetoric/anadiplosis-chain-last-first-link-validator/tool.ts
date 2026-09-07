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
  const w = input.clauses.map(tokenInventory);
  if (w.some((v) => !v.length))
    simpleError("clauses", "Nonempty lexical clauses.");
  const flags = w.slice(1).map((v, i) => w[i].at(-1) === v[0]);
  return {
    linkedBoundaryIndices: flags.flatMap((v, i) => (v ? [i] : [])),
    unlinkedBoundaryIndices: flags.flatMap((v, i) => (v ? [] : [i])),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { clauses: ["seek wisdom", "wisdom brings peace", "peace remains"] },
  output: {
    result: { linkedBoundaryIndices: [0, 1], unlinkedBoundaryIndices: [] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/anadiplosis-chain-last-first-link-validator",
  title: "Anadiplosis Chain Last First Link Validator",
  description:
    "Compare exact last-to-first words at adjacent explicit clause boundaries, without lemma/sound normalization.",
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
