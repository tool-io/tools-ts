import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch53-shared.js";

export type Input = Readonly<{
  left: readonly string[];
  right: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", label: "Left", kind: "stringList" },
  { id: "right", label: "Right", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const values: string[] = [],
    sources: { side: string; index: number }[] = [];
  for (let j = 0; j < Math.max(i.left.length, i.right.length); j++) {
    if (j < i.left.length) {
      values.push(i.left[j]);
      sources.push({ side: "left", index: j });
    }
    if (j < i.right.length) {
      values.push(i.right[j]);
      sources.push({ side: "right", index: j });
    }
  }
  return { values, sources };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { left: ["a", "b"], right: ["x"] },
  output: {
    result: {
      values: ["a", "x", "b"],
      sources: [
        { side: "left", index: 0 },
        { side: "right", index: 0 },
        { side: "left", index: 1 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "list/indexed-interleave",
  title: "Indexed Interleave Tool",
  description:
    "Interleave explicit lists with source-side and source-index provenance; retain unequal-length tails.",
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
