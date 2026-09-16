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
  const next =
    i.origin + (Math.floor((i.tick - i.origin) / i.grid) + 1) * i.grid;
  return H.finish({ next, delay: next - i.tick });
};
export const example = {
  input: { tick: 6, grid: 4, origin: 2 },
  output: { result: { next: 10, delay: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/loop-next-grid-event",
  title: "Loop Next Grid Event",
  description:
    "Find the strictly next musical grid event; an event exactly at the current tick is skipped.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
