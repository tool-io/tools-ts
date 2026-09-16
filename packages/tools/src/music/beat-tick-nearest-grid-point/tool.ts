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
  const q = Math.floor((i.tick - i.origin) / i.grid),
    lower = i.origin + q * i.grid,
    upper = lower + i.grid,
    nearest = i.tick - lower < upper - i.tick ? lower : upper;
  return H.finish({
    nearest,
    error: nearest - i.tick,
    tie: i.tick - lower === upper - i.tick,
  });
};
export const example = {
  input: { tick: 4, grid: 4, origin: 2 },
  output: { result: { nearest: 6, error: 2, tie: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/beat-tick-nearest-grid-point",
  title: "Beat Tick Nearest Grid Point",
  description:
    "Find nearest integer tick grid point with midpoint ties forward and expose signed quantization error.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
