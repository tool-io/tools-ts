import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ turn: number; sectors: number; origin: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "turn", label: "turn", kind: "number" },
  { id: "sectors", label: "sectors", kind: "integer" },
  { id: "origin", label: "origin", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.sectors, 1, 1e6);
  const p = H.normTurn((i.turn - i.origin) * i.sectors);
  return H.finish({ distance: Math.min(p, 1 - p) / i.sectors });
};
export const example = {
  input: { turn: 0.3, sectors: 4, origin: 0 },
  output: { result: { distance: 0.05 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Turn Sector Boundary Distance", "angles", "mathematics"],
    collections: ["data", "learn"],
    fields: ["angle", "angles", "mathematics"],
    keywords: ["angles", "mathematics"],
  },
  id: "angle/turn-sector-boundary-distance",
  title: "Turn Sector Boundary Distance",
  description:
    "Compute circular turn distance to the nearest equal-sector boundary, not the sector center or a linear clock endpoint.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { distance: { type: "number" } },
        required: ["distance"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
