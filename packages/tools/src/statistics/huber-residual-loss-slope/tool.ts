import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ residual: number; delta: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "residual", label: "residual", kind: "number" },
  { id: "delta", label: "delta", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.delta);
  const a = Math.abs(i.residual);
  return H.finish({
    loss:
      a <= i.delta
        ? 0.5 * i.residual * i.residual
        : i.delta * (a - 0.5 * i.delta),
    slope: a <= i.delta ? i.residual : Math.sign(i.residual) * i.delta,
  });
};
export const example = {
  input: { residual: -3, delta: 2 },
  output: { result: { loss: 4, slope: -2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "statistics/huber-residual-loss-slope",
  title: "Huber Residual Loss Slope",
  description:
    "Return Huber residual loss and its signed derivative at a positive explicit transition delta; slope adds behavior beyond existing scalar Huber loss.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
