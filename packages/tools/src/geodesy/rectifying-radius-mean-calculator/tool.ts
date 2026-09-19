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
  H.check(p.f <= 0.02);
  return H.finish({
    rectifyingRadiusMeters:
      (2 * H.meridianArc(p.a, p.f, Math.PI / 2)) / Math.PI,
  });
};
export const example = {
  input: { semiMajorMeters: 10, semiMinorMeters: 10 },
  output: { result: { rectifyingRadiusMeters: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/rectifying-radius-mean-calculator",
  title: "Rectifying Radius Mean Radius Calculator",
  description:
    "Compute rectifying radius as meridian-quadrant length divided by pi/2 using bounded 1024-panel Simpson integration; b>=0.98a, not arithmetic mean radius.",
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
