import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  current: number;
  next: number;
  expectedDifference: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "current", label: "Current", kind: "number" },
  { id: "next", label: "Next", kind: "number" },
  { id: "expectedDifference", label: "Expected difference", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    residual: i.next - i.current - i.expectedDifference,
    exactlyConsistent: i.next - i.current === i.expectedDifference,
  });
};
export const example = {
  input: { current: 2, next: 5, expectedDifference: 2 },
  output: { result: { residual: 1, exactlyConsistent: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sequence/arithmetic-term-adjacent-residual",
  title: "Sequence: Arithmetic Term Adjacent Residual Tool",
  description:
    "Check one adjacent arithmetic recurrence transition against an explicit difference, exposing residual rather than fitting a sequence.",
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
