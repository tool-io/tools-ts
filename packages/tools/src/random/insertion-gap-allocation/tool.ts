import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  length: number;
  insertions: number;
  seed: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "length", label: "length", kind: "integer" },
  { id: "insertions", label: "insertions", kind: "integer" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  H.int(i.length, 0, 127);
  H.int(i.insertions, 1, 128);
  const gaps = Array.from({ length: i.insertions }, () =>
    H.randint(0, i.length, random),
  );
  return H.finish({
    seed: i.seed,
    gaps,
    counts: Array.from(
      { length: i.length + 1 },
      (_, j) => gaps.filter((x) => x === j).length,
    ),
  });
};
export const example = {
  input: { length: 3, insertions: 2, seed: "batch56" },
  output: { result: { seed: "batch56", gaps: [0, 0], counts: [2, 0, 0, 0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/insertion-gap-allocation",
  title: "Random Insertion Gap Allocation",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Assign each labeled insertion independently to one of N+1 original sequence gaps uniformly; repeated gaps permitted, not uniform over count compositions.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
