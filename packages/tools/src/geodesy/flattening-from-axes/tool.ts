import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  semiMajorMeters: number;
  semiMinorMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "semiMajorMeters",
    label: "Semi major meters",
    kind: "number",
    unit: "m",
  },
  {
    id: "semiMinorMeters",
    label: "Semi minor meters",
    kind: "number",
    unit: "m",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const p = H.axes(i.semiMajorMeters, i.semiMinorMeters);
  return H.finish({ flattening: p.f });
};
export const example = {
  input: { semiMajorMeters: 10, semiMinorMeters: 9 },
  output: { result: { flattening: 0.1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/flattening-from-axes",
  title: "Ellipsoid Flattening from Axes Calculator f=(a-b)/a",
  description:
    "Compute oblate ellipsoid geometric flattening (a-b)/a from matching metre axes; supports spheres and b>=0.9a, not dynamical flattening.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit geodesy result; see field names for units",
      kind: "object",
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
