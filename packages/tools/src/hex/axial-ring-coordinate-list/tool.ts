import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ q: number; r: number; radius: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "q", label: "q", kind: "integer" },
  { id: "r", label: "r", kind: "integer" },
  { id: "radius", label: "radius", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ coordinates: H.hexRing(i.q, i.r, i.radius) });
};
export const example = {
  input: { q: 0, r: 0, radius: 1 },
  output: {
    result: {
      coordinates: [
        [-1, 1],
        [0, 1],
        [1, 0],
        [1, -1],
        [0, -1],
        [-1, 0],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "hex/axial-ring-coordinate-list",
  title: "Hex Axial Ring Coordinate List",
  description:
    "Enumerate one axial hex ring in a fixed six-direction walk; radius zero is the center and positive rings are bounded to 126 cells.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
