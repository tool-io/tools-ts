import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ index: number; period: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "index", label: "Index", kind: "integer" },
  { id: "period", label: "Period", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.index, -1000000000, 1000000000);
  H.int(i.period, 1, 1000000000);
  return H.finish({
    cycle: Math.floor(i.index / i.period),
    phase: H.mod(i.index, i.period),
  });
};
export const example = {
  input: { index: -1, period: 4 },
  output: { result: { cycle: -1, phase: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sequence/periodic-index-quotient-remainder",
  title: "Sequence: Periodic Index Quotient Remainder Tool",
  description:
    "Decompose a signed sequence index into floor quotient and nonnegative within-period phase, retaining negative cycle numbers.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { cycle: { type: "number" }, phase: { type: "number" } },
        required: ["cycle", "phase"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
