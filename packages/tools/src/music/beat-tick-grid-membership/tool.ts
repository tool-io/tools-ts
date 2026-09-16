import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ tick: number; grid: number; origin: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "tick", kind: "integer", label: "tick" },
  { id: "grid", kind: "integer", label: "grid" },
  { id: "origin", kind: "integer", label: "origin" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.tick, -1e9, 1e9);
  H.int(i.origin, -1e9, 1e9);
  H.int(i.grid, 1);
  return H.finish({ member: H.mod(i.tick - i.origin, i.grid) === 0 });
};
export const example = {
  input: { tick: 10, grid: 4, origin: 2 },
  output: { result: { member: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/beat-tick-grid-membership",
  title: "Beat Tick Grid Membership",
  description:
    "Test integer musical tick-grid membership relative to an explicit origin; does not infer tempo or quantize audio.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
