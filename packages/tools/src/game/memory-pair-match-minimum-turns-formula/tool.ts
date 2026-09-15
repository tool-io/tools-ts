import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch52-shared.js";
export type Input = Readonly<{ readonly pairs: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "pairs", label: "Pairs", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  bounded(i.pairs, "pairs", 0, 1000000);
  return { minimumTwoCardTurns: i.pairs };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { pairs: 8 },
  output: { result: { minimumTwoCardTurns: 8 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/memory-pair-match-minimum-turns-formula",
  title: "Memory Pair Minimum Turns Formula",
  description:
    "Best-case minimum successful two-card turns to clear explicit pair count; assumes perfect knowledge and no extra mechanics.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
