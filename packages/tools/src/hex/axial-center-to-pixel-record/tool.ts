import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  q: number;
  r: number;
  size: number;
  pointy: boolean;
  origin: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "q", label: "q", kind: "number" },
  { id: "r", label: "r", kind: "number" },
  { id: "size", label: "size", kind: "number" },
  { id: "pointy", label: "pointy", kind: "boolean" },
  { id: "origin", label: "origin", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.size);
  H.point(i.origin);
  return H.finish({
    point: i.pointy
      ? [
          i.origin[0] + i.size * Math.sqrt(3) * (i.q + i.r / 2),
          i.origin[1] + i.size * 1.5 * i.r,
        ]
      : [
          i.origin[0] + i.size * 1.5 * i.q,
          i.origin[1] + i.size * Math.sqrt(3) * (i.r + i.q / 2),
        ],
  });
};
export const example = {
  input: { q: 0, r: 0, size: 2, pointy: true, origin: [3, 4] },
  output: { result: { point: [3, 4] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "hex/axial-center-to-pixel-record",
  title: "Hex Axial Center to Pixel Record",
  description:
    "Map supplied fractional axial hex coordinates to Cartesian pixel centers for explicit pointy/flat orientation, circumradius and origin; no geographic units.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
