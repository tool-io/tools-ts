import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ turn: number; sectors: number; origin: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "turn", label: "turn", kind: "number" },
  { id: "sectors", label: "sectors", kind: "integer" },
  { id: "origin", label: "origin", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.sectors, 1, 1e6);
  return H.finish({
    index: Math.floor(H.normTurn(i.turn - i.origin) * i.sectors),
  });
};
export const example = {
  input: { turn: 0.3, sectors: 4, origin: 0 },
  output: { result: { index: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "angle/turn-sector-index",
  title: "Turn Sector Index",
  description:
    "Locate a continuous turn in one of equally sized half-open sectors relative to an explicit angular origin; no compass naming convention.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
