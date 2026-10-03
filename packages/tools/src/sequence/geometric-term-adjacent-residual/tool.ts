import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  current: number;
  next: number;
  expectedRatio: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "current", label: "Current", kind: "number" },
  { id: "next", label: "Next", kind: "number" },
  { id: "expectedRatio", label: "Expected ratio", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    residual: i.next - i.current * i.expectedRatio,
    exactlyConsistent: i.next === i.current * i.expectedRatio,
  });
};
export const example = {
  input: { current: 2, next: 7, expectedRatio: 3 },
  output: { result: { residual: 1, exactlyConsistent: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sequence/geometric-term-adjacent-residual",
  title: "Sequence: Geometric Term Adjacent Residual Tool",
  description:
    "Check one adjacent geometric recurrence transition against an explicit multiplier, with no division by zero or sequence fitting.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          exactlyConsistent: { type: "boolean" },
          residual: { type: "number" },
        },
        required: ["exactlyConsistent", "residual"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
