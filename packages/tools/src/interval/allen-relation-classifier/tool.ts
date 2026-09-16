import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, orderedPair } from "../batch53-shared.js";

export type Input = Readonly<{
  aStart: number;
  aEnd: number;
  bStart: number;
  bEnd: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "aStart", label: "A start", kind: "number" },
  { id: "aEnd", label: "A end", kind: "number" },
  { id: "bStart", label: "B start", kind: "number" },
  { id: "bEnd", label: "B end", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  orderedPair(i.aStart, i.aEnd, true);
  orderedPair(i.bStart, i.bEnd, true);
  const a = i.aStart,
    b = i.aEnd,
    c = i.bStart,
    d = i.bEnd;
  let relation = "";
  if (b < c) relation = "before";
  else if (b === c) relation = "meets";
  else if (a > d) relation = "after";
  else if (a === d) relation = "met-by";
  else if (a === c && b === d) relation = "equal";
  else if (a === c) relation = b < d ? "starts" : "started-by";
  else if (b === d) relation = a > c ? "finishes" : "finished-by";
  else if (a > c && b < d) relation = "during";
  else if (a < c && b > d) relation = "contains";
  else relation = a < c ? "overlaps" : "overlapped-by";
  return { relation };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { aStart: 0, aEnd: 2, bStart: 1, bEnd: 3 },
  output: { result: { relation: "overlaps" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "interval/allen-relation-classifier",
  title: "Allen Interval Relation Classifier",
  description:
    "Classify the 13 Allen relations between finite positive-length intervals, with A relative to B and exact endpoint equality.",
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
