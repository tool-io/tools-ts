import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ reading: number; quantum: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "reading", label: "Reading", kind: "number" },
  { id: "quantum", label: "Quantum", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.quantum);
  return H.finish({
    halfwidth: i.quantum / 2,
    lower: i.reading - i.quantum / 2,
    upper: i.reading + i.quantum / 2,
  });
};
export const example = {
  input: { reading: 10, quantum: 0.2 },
  output: { result: { halfwidth: 0.1, lower: 9.9, upper: 10.1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "distance/range-reading-quantization-halfwidth",
  title: "Distance: Range Reading Quantization Halfwidth Tool",
  description:
    "Return the rounding-bin halfwidth and endpoint values for an explicit quantum; not a full measurement uncertainty, confidence interval or endpoint tie policy.",
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
          halfwidth: { type: "number" },
          lower: { type: "number" },
          upper: { type: "number" },
        },
        required: ["halfwidth", "lower", "upper"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
