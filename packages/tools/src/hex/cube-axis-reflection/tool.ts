import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ cube: readonly number[]; axis: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "cube", label: "cube", kind: "numberList" },
  { id: "axis", label: "axis", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.cube(i.cube);
  H.check(["x", "y", "z"].includes(i.axis));
  const p = [...i.cube],
    a = i.axis === "x" ? 1 : 0,
    b = i.axis === "z" ? 1 : 2;
  [p[a], p[b]] = [p[b], p[a]];
  return H.finish({ cube: p });
};
export const example = {
  input: { cube: [1, -1, 0], axis: "x" },
  output: { result: { cube: [1, 0, -1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "hex/cube-axis-reflection",
  title: "Hex Cube Axis Reflection",
  description:
    "Reflect integer hex cube coordinates across a named cube axis by swapping the other two components; preserves zero-sum coordinates.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
