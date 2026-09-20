import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ x: number; alpha: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "x", label: "X", kind: "number" },
  { id: "alpha", label: "Alpha", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.alpha);
  const z = i.x / i.alpha;
  H.check(Number.isFinite(z));
  return H.finish({
    alphaPartial: i.x >= 0 ? 0 : Math.expm1(z) - z * Math.exp(z),
  });
};
export const example = {
  input: { x: 0, alpha: 2 },
  output: { result: { alphaPartial: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "activation/celu-alpha-partial-derivative",
  title: "Activation: CELU Alpha Partial Derivative Tool",
  description:
    "Evaluate the alpha partial of CELU alpha*(exp(x/alpha)-1) on its negative branch and zero on its linear branch, using supplied positive alpha.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { alphaPartial: { type: "number" } },
        required: ["alphaPartial"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
