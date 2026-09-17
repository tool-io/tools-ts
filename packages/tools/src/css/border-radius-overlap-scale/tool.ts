import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  width: number;
  height: number;
  horizontal: readonly number[];
  vertical: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "width", label: "width", kind: "number" },
  { id: "height", label: "height", kind: "number" },
  { id: "horizontal", label: "horizontal", kind: "numberList" },
  { id: "vertical", label: "vertical", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.width);
  H.positive(i.height);
  H.check(i.width <= 1e9 && i.height <= 1e9);
  const h = H.quad(i.horizontal),
    v = H.quad(i.vertical),
    ratio = (n: number, d: number) => (d ? n / d : 1);
  const scale = Math.min(
    1,
    ratio(i.width, h[0] + h[1]),
    ratio(i.width, h[3] + h[2]),
    ratio(i.height, v[0] + v[3]),
    ratio(i.height, v[1] + v[2]),
  );
  return H.finish({
    scale,
    horizontal: h.map((x) => x * scale),
    vertical: v.map((x) => x * scale),
  });
};
export const example = {
  input: { width: 10, height: 8, horizontal: [8], vertical: [2] },
  output: {
    result: {
      scale: 0.625,
      horizontal: [5, 5, 5, 5],
      vertical: [1.25, 1.25, 1.25, 1.25],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/border-radius-overlap-scale",
  title: "CSS Border Radius Overlap Scale",
  description:
    "Apply the CSS uniform corner-radius overlap reduction to explicit resolved numeric dimensions; zero-radius sums impose no constraint.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
