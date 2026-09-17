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
    half: i.t < 0.5 ? "in" : "out",
    localTime: i.t < 0.5 ? 2 * i.t : 2 * i.t - 1,
    valueScale: 0.5,
    valueOffset: i.t < 0.5 ? 0 : 0.5,
  });
};
export const example = {
  input: { t: 0.75 },
  output: {
    result: { half: "out", localTime: 0.5, valueScale: 0.5, valueOffset: 0.5 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "easing/unit-easing-inout-time-map",
  title: "Unit Easing In Out Time Map",
  description:
    "Map a unit progress into an in/out half\u2019s local time and value affine parameters; caller separately evaluates the appropriate easing branch.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
