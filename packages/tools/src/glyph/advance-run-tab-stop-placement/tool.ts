import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  positions: readonly number[];
  tabStops: readonly number[];
  interval: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "positions", label: "positions", kind: "numberList" },
  { id: "tabStops", label: "tabStops", kind: "numberList" },
  { id: "interval", label: "interval", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.interval);
  H.check(i.tabStops.every((x, j) => j === 0 || x > i.tabStops[j - 1]));
  return H.finish({
    positions: i.positions.map((x) => {
      const explicit = i.tabStops.find((t) => t > x);
      if (explicit !== undefined) return explicit;
      const origin = i.tabStops.at(-1) ?? 0;
      return origin + (Math.floor((x - origin) / i.interval) + 1) * i.interval;
    }),
  });
};
export const example = {
  input: { positions: [0, 4, 10], tabStops: [4, 8], interval: 4 },
  output: { result: { positions: [4, 8, 12] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glyph/advance-run-tab-stop-placement",
  title: "Glyph Advance Run Tab Stop Placement",
  description:
    "Place glyph-run tab positions at the next strictly greater explicit stop, then repeat a supplied positive interval after the last stop; no text shaping.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
