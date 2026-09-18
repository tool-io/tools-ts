import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ cube: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "cube", label: "cube", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ cube: H.cubeRound(i.cube) });
};
export const example = {
  input: { cube: [0.6, -0.2, -0.4] },
  output: { result: { cube: [1, 0, -1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "hex/cube-fractional-rounding",
  title: "Hex Fractional Cube Rounding",
  description:
    "Round zero-sum fractional hex cube coordinates and repair the largest rounding-error component to preserve zero sum; ties repair z then y under the documented strict comparisons.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
