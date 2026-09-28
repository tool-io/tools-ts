import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  semiMajor: number;
  semiMinor: number;
  point: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "semiMajor", label: "Semi major", kind: "number" },
  { id: "semiMinor", label: "Semi minor", kind: "number" },
  { id: "point", label: "Point", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.semiMajor);
  H.check(i.semiMinor > 0 && i.semiMinor < i.semiMajor && i.point.length === 2);
  const c = Math.sqrt(
      (i.semiMajor - i.semiMinor) * (i.semiMajor + i.semiMinor),
    ),
    e = c / i.semiMajor,
    fd = Math.hypot(i.point[0] - c, i.point[1]),
    dd = Math.abs(i.point[0] - i.semiMajor / e);
  return H.finish({
    focusDistance: fd,
    directrixDistance: dd,
    eccentricity: e,
    residual: fd - e * dd,
  });
};
export const example = {
  input: { semiMajor: 5, semiMinor: 3, point: [5, 0] },
  output: {
    result: {
      focusDistance: 1,
      directrixDistance: 1.25,
      eccentricity: 0.8,
      residual: 0,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geometry/ellipse-focus-directrix-gap",
  title: "Geometry: Ellipse Focus Directrix Gap Tool",
  description:
    "Evaluate the right-focus/right-directrix ellipse distance residual for an axis-aligned noncircular ellipse; no fitting, closest-point solver or approximate membership tolerance.",
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
          directrixDistance: { type: "number" },
          eccentricity: { type: "number" },
          focusDistance: { type: "number" },
          residual: { type: "number" },
        },
        required: [
          "directrixDistance",
          "eccentricity",
          "focusDistance",
          "residual",
        ],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
