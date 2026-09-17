import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ t: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "t", label: "t", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.unit(i.t);
  return H.finish({
    value: i.t < 0.5 ? 2 * i.t * i.t : 1 - (-2 * i.t + 2) ** 2 / 2,
  });
};
export const example = {
  input: { t: 0.25 },
  output: { result: { value: 0.125 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "easing/unit-quadratic-inout-value",
  title: "Unit Quadratic In Out Easing Value",
  description:
    "Evaluate Unit Quadratic In Out Easing Value on the closed unit domain; deterministic numerical curve arithmetic without animation scheduling.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
