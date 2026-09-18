import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  from: readonly number[];
  to: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "from", label: "from", kind: "numberList" },
  { id: "to", label: "to", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.cube(i.from);
  H.cube(i.to);
  const distance = Math.max(...i.from.map((x, j) => Math.abs(x - i.to[j])));
  H.int(distance, 0, 127);
  return H.finish({
    coordinates: Array.from({ length: distance + 1 }, (_, j) =>
      H.cubeRound(
        i.from.map((x, k) =>
          distance ? x + ((i.to[k] - x) * j) / distance : x,
        ),
      ),
    ),
  });
};
export const example = {
  input: { from: [0, 0, 0], to: [2, -2, 0] },
  output: {
    result: {
      coordinates: [
        [0, 0, 0],
        [1, -1, 0],
        [2, -2, 0],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "hex/cube-line-coordinate-list",
  title: "Hex Cube Line Coordinate List",
  description:
    "Enumerate a bounded shortest hex cube line by linear interpolation and deterministic zero-sum rounding, including both endpoints; no obstacles or tie-randomization.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
