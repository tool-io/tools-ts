import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  from: readonly number[];
  to: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "from", kind: "numberList", label: "from" },
  { id: "to", kind: "numberList", label: "to" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.from.length === 3 && i.to.length === 3);
  [i.from, i.to].forEach((r) => {
    r.forEach((x) => H.int(x, -1e9, 1e9));
    H.check(r.reduce((s, x) => s + x, 0) === 0);
  });
  return H.finish({
    distance: Math.max(...i.from.map((x, j) => Math.abs(x - i.to[j]))),
  });
};
export const example = {
  input: { from: [0, 0, 0], to: [2, -1, -1] },
  output: { result: { distance: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "board/board-hex-cube-distance",
  title: "Board Hex Cube Distance",
  description:
    "Compute exact infinite-grid hex distance between validated cube coordinates; no obstacles, terrain or pathfinding.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
