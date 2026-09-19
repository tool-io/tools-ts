import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ pairs: number; seed: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "pairs", label: "pairs", kind: "integer" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  H.int(i.pairs, 1, 64);
  const ways = H.dyckCounts(i.pairs),
    total = ways(0, 0);
  let rank = H.randomBig(total, random),
    a = 0,
    b = 0,
    word = "";
  while (b < i.pairs) {
    const opens = a < i.pairs ? ways(a + 1, b) : 0n;
    if (rank < opens) {
      word += "(";
      a++;
    } else {
      rank -= opens;
      word += ")";
      b++;
    }
  }
  return H.finish({ seed: i.seed, word, support: String(total) });
};
export const example = {
  input: { pairs: 3, seed: "batch56" },
  output: { result: { seed: "batch56", word: "((()))", support: "5" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/fixed-pair-dyck-word",
  title: "Random Fixed-Pair Dyck Word",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Uniformly sample a fixed-pair Dyck word by exact valid-completion count unranking; no rejection of unbalanced random strings, bounded to 64 pairs.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
