import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ t: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "t", label: "T", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.t, 0, 1);
  const v = H.hermiteBasis(i.t);
  return H.finish({ h00: v[0], h10: v[1], h01: v[2], h11: v[3] });
};
export const example = {
  input: { t: 0.5 },
  output: { result: { h00: 0.5, h10: 0.125, h01: 0.5, h11: -0.125 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "interpolation/cubic-hermite-four-basis-values",
  title: "Interpolation: Cubic Hermite Four Basis Values Tool",
  description:
    "Return all four cubic Hermite basis values by evaluating the existing reviewed interpolator on four unit coefficient vectors; no duplicate basis formulas.",
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
          h00: { type: "number" },
          h01: { type: "number" },
          h10: { type: "number" },
          h11: { type: "number" },
        },
        required: ["h00", "h01", "h10", "h11"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
