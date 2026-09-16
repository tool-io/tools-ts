import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
  sum,
  unique,
} from "../batch53-shared.js";

export type Input = Readonly<{
  values: readonly string[];
  blockLengths: readonly number[];
  order: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "values", label: "Values", kind: "stringList" },
  { id: "blockLengths", label: "Block lengths", kind: "numberList" },
  { id: "order", label: "Order", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  i.blockLengths.forEach((v) => bounded(v, "block", 1, 128));
  if (
    sum(i.blockLengths) !== i.values.length ||
    i.order.length !== i.blockLengths.length
  )
    simpleError("blocks", "Exact partition and permutation.");
  i.order.forEach((v) => bounded(v, "order", 0, i.order.length - 1));
  if (new Set(i.order).size !== i.order.length)
    simpleError("order", "Unique permutation indexes.");
  let k = 0;
  const blocks = i.blockLengths.map((n) => {
    const a = i.values.slice(k, k + n);
    k += n;
    return a;
  });
  return { values: i.order.flatMap((j) => blocks[j]) };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { values: ["a", "b", "c"], blockLengths: [2, 1], order: [1, 0] },
  output: { result: { values: ["c", "a", "b"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "list/contiguous-block-permutation-applier",
  title: "Contiguous Block Permutation Applier",
  description:
    "Permute complete contiguous blocks using explicit positive block lengths and an exact zero-based permutation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
