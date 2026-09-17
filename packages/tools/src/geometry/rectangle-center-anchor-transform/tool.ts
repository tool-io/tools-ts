import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  anchor: readonly number[];
  width: number;
  height: number;
  fractionX: number;
  fractionY: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "anchor", label: "anchor", kind: "numberList" },
  { id: "width", label: "width", kind: "number" },
  { id: "height", label: "height", kind: "number" },
  { id: "fractionX", label: "fractionX", kind: "number" },
  { id: "fractionY", label: "fractionY", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.point(i.anchor);
  H.check(i.width >= 0 && i.height >= 0);
  const x = i.anchor[0] - i.width * i.fractionX,
    y = i.anchor[1] - i.height * i.fractionY;
  return H.finish({ rectangle: [x, y, x + i.width, y + i.height] });
};
export const example = {
  input: {
    anchor: [10, 20],
    width: 4,
    height: 6,
    fractionX: 0.5,
    fractionY: 0.5,
  },
  output: { result: { rectangle: [8, 17, 12, 23] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geometry/rectangle-center-anchor-transform",
  title: "Rectangle Center Anchor Transform",
  description:
    "Position a rectangle around a supplied fractional anchor, with nonnegative dimensions and arbitrary explicit fractions; no CSS writing-mode interpretation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
