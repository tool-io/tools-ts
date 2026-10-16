import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ column: number; row: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "column", label: "column", kind: "integer" },
  { id: "row", label: "row", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  for (const v of Object.values(i)) H.int(v, -1e9, 1e9);
  return H.finish({
    q: i.column,
    r: i.row - (i.column + H.mod(i.column, 2)) / 2,
  });
};
export const example = {
  input: { column: 1, row: 2 },
  output: { result: { q: 1, r: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Hex Even Column Offset to Axial", "hexadecimal", "encoding"],
    collections: ["encode-decode"],
    fields: ["hex", "hexadecimal", "encoding"],
    keywords: ["hexadecimal", "encoding"],
  },
  id: "hex/even-column-offset-to-axial",
  title: "Hex Even Column Offset to Axial",
  description:
    "Convert signed integer hex coordinates between axial and even-column offset convention; floor-compatible parity handles negative coordinates, no geographic projection.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { q: { type: "number" }, r: { type: "number" } },
        required: ["q", "r"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
