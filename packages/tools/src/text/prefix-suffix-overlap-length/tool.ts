import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch53-shared.js";

export type Input = Readonly<{ left: string; right: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", label: "Left", kind: "string" },
  { id: "right", label: "Right", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  let length = Math.min(i.left.length, i.right.length);
  while (length > 0 && i.left.slice(-length) !== i.right.slice(0, length))
    length--;
  return { overlapLength: length, overlap: i.right.slice(0, length) };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { left: "ababa", right: "babc" },
  output: { result: { overlapLength: 2, overlap: "ba" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/prefix-suffix-overlap-length",
  title: "Prefix Suffix Overlap Length",
  description:
    "Find the longest literal suffix(left)/prefix(right) overlap in UTF-16 units, including zero and full overlap.",
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
