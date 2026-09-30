import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  firstNode: number;
  firstValue: number;
  secondNode: number;
  secondValue: number;
  tolerance: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "firstNode", label: "First node", kind: "number" },
  { id: "firstValue", label: "First value", kind: "number" },
  { id: "secondNode", label: "Second node", kind: "number" },
  { id: "secondValue", label: "Second value", kind: "number" },
  { id: "tolerance", label: "Tolerance", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.tolerance >= 0);
  return H.finish({
    duplicateNode: i.firstNode === i.secondNode,
    valueConflict:
      i.firstNode === i.secondNode &&
      Math.abs(i.firstValue - i.secondValue) > i.tolerance,
  });
};
export const example = {
  input: {
    firstNode: 1,
    firstValue: 2,
    secondNode: 1,
    secondValue: 3,
    tolerance: 0,
  },
  output: { result: { duplicateNode: true, valueConflict: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "interpolation/interpolation-duplicate-node-value-conflict",
  title: "Interpolation: Interpolation Duplicate Node Value Conflict Tool",
  description:
    "Inspect one exact duplicate-node pair for inconsistent values under explicit absolute value tolerance; no node merging or spline construction.",
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
          duplicateNode: { type: "boolean" },
          valueConflict: { type: "boolean" },
        },
        required: ["duplicateNode", "valueConflict"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
