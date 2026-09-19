import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ pairsJson: string; seed: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "pairsJson", label: "pairsJson", kind: "string" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  const pairs = H.buckets(i.pairsJson);
  H.check(pairs.length > 0 && pairs.every((v) => v.length === 2));
  return H.finish({
    seed: i.seed,
    pairs: pairs.map((pair, index) => {
      const reversed = H.randint(0, 1, random) === 1;
      return { index, reversed, values: reversed ? [...pair].reverse() : pair };
    }),
  });
};
export const example = {
  input: { pairsJson: '[["a","b"],["c","d"]]', seed: "batch56" },
  output: {
    result: {
      seed: "batch56",
      pairs: [
        { index: 0, reversed: false, values: ["a", "b"] },
        { index: 1, reversed: false, values: ["c", "d"] },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/supplied-pair-orientations",
  title: "Random Supplied Pair Orientations",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Independently choose either orientation for each supplied two-position pair without changing pair membership; equal labels may render identically.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
