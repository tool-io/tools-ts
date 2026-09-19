import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  values: readonly string[];
  swaps: number;
  seed: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "values", label: "values", kind: "stringList" },
  { id: "swaps", label: "swaps", kind: "integer" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  H.check(i.values.length >= 2);
  H.int(i.swaps, 1, 128);
  const order = i.values.map((_, j) => j),
    trace: number[][] = [];
  for (let j = 0; j < i.swaps; j++) {
    const a = H.randint(0, order.length - 1, random),
      raw = H.randint(0, order.length - 2, random),
      b = raw >= a ? raw + 1 : raw;
    [order[a], order[b]] = [order[b], order[a]];
    trace.push([a, b]);
  }
  return H.finish({
    seed: i.seed,
    trace,
    sourceIndexes: order,
    values: order.map((j) => i.values[j]),
  });
};
export const example = {
  input: { values: ["a", "b", "c"], swaps: 2, seed: "batch56" },
  output: {
    result: {
      seed: "batch56",
      trace: [
        [0, 1],
        [0, 1],
      ],
      sourceIndexes: [0, 1, 2],
      values: ["a", "b", "c"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/indexed-swap-trace",
  title: "Random Indexed Swap Trace",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Perform a fixed number of independent uniformly selected ordered distinct-position swaps, retaining index trace; not a uniform final permutation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
