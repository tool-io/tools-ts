import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  index: number;
  sectors: number;
  origin: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "index", label: "index", kind: "integer" },
  { id: "sectors", label: "sectors", kind: "integer" },
  { id: "origin", label: "origin", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.sectors, 1, 1e6);
  H.int(i.index, 0, i.sectors - 1);
  return H.finish({ turn: H.normTurn(i.origin + (i.index + 0.5) / i.sectors) });
};
export const example = {
  input: { index: 1, sectors: 4, origin: 0 },
  output: { result: { turn: 0.375 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Turn Sector Center", "angles", "mathematics"],
    collections: ["data", "learn"],
    fields: ["angle", "angles", "mathematics"],
    keywords: ["angles", "mathematics"],
  },
  id: "angle/turn-sector-center",
  title: "Turn Sector Center",
  description:
    "Return the normalized center turn of an explicit zero-based equal angular sector; origin is a caller coordinate.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { turn: { type: "number" } },
        required: ["turn"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
