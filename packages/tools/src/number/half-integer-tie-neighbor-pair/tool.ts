import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ value: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "value", label: "Value", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.value, -1e12, 1e12);
  const low = Math.floor(i.value);
  return H.finish({
    halfIntegerTie: Math.abs(i.value - low) === 0.5,
    lowerInteger: low,
    upperInteger: Math.ceil(i.value),
  });
};
export const example = {
  input: { value: -1.5 },
  output: {
    result: { halfIntegerTie: true, lowerInteger: -2, upperInteger: -1 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "number/half-integer-tie-neighbor-pair",
  title: "Number: Half Integer Tie Neighbor Pair Tool",
  description:
    "Report the integer neighbors and exact half-integer tie status of one safely bounded number without imposing a rounding policy.",
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
          halfIntegerTie: { type: "boolean" },
          lowerInteger: { type: "number" },
          upperInteger: { type: "number" },
        },
        required: ["halfIntegerTie", "lowerInteger", "upperInteger"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
