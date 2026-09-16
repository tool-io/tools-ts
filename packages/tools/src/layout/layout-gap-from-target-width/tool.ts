import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  nonnegative,
} from "../batch53-shared.js";

export type Input = Readonly<{
  targetWidth: number;
  itemWidth: number;
  itemCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "targetWidth", label: "Target width", kind: "number" },
  { id: "itemWidth", label: "Item width", kind: "number" },
  { id: "itemCount", label: "Item count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(i.targetWidth, "target");
  nonnegative(i.itemWidth, "item");
  bounded(i.itemCount, "count", 2, 1e9);
  const gap = (i.targetWidth - i.itemCount * i.itemWidth) / (i.itemCount - 1);
  return { signedGap: gap, nonnegativeGapPossible: gap >= 0 };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { targetWidth: 100, itemWidth: 30, itemCount: 3 },
  output: { result: { signedGap: 5, nonnegativeGapPossible: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "layout/layout-gap-from-target-width",
  title: "Layout Gap from Target Width",
  description:
    "Solve uniform inter-item gap for an exact target row width; preserve negative infeasibility instead of clamping.",
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
