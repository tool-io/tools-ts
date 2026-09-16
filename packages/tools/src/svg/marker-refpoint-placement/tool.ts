import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  refX: number;
  refY: number;
  anchorX: number;
  anchorY: number;
  scale: number;
  angleDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "refX", kind: "number", label: "refX" },
  { id: "refY", kind: "number", label: "refY" },
  { id: "anchorX", kind: "number", label: "anchorX" },
  { id: "anchorY", kind: "number", label: "anchorY" },
  { id: "scale", kind: "number", label: "scale" },
  { id: "angleDegrees", kind: "number", label: "angleDegrees" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.scale);
  const t = (i.angleDegrees * Math.PI) / 180,
    c = Math.cos(t),
    s = Math.sin(t);
  return H.finish({
    translateX: i.anchorX - i.scale * (i.refX * c - i.refY * s),
    translateY: i.anchorY - i.scale * (i.refX * s + i.refY * c),
  });
};
export const example = {
  input: {
    refX: 2,
    refY: 3,
    anchorX: 10,
    anchorY: 20,
    scale: 2,
    angleDegrees: 0,
  },
  output: { result: { translateX: 6, translateY: 14 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "svg/marker-refpoint-placement",
  title: "SVG Marker Reference Point Placement",
  description:
    "Place a marker reference point at an anchor after uniform scale and rotation; coordinates are in the same caller-defined plane.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
