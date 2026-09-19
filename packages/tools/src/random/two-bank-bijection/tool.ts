import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  left: readonly string[];
  right: readonly string[];
  seed: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", label: "left", kind: "stringList" },
  { id: "right", label: "right", kind: "stringList" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  H.uniqueIds(i.left);
  H.uniqueIds(i.right);
  H.check(i.left.length === i.right.length && i.left.length > 1);
  const right = H.shuffle(i.right, random);
  return H.finish({
    seed: i.seed,
    pairs: i.left.map((left, j) => ({ left, right: right[j] })),
  });
};
export const example = {
  input: { left: ["a", "b"], right: ["x", "y"], seed: "batch56" },
  output: {
    result: {
      seed: "batch56",
      pairs: [
        { left: "a", right: "y" },
        { left: "b", right: "x" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/two-bank-bijection",
  title: "Random Two-Bank Bijection",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Assign unique supplied right-bank IDs to left-bank IDs by a uniform full bijection, not arbitrary graph matching or schedule generation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
