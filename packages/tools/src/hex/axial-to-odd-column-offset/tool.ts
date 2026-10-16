import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ q: number; r: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "q", label: "q", kind: "integer" },
  { id: "r", label: "r", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  for (const v of Object.values(i)) H.int(v, -1e9, 1e9);
  return H.finish({ column: i.q, row: i.r + (i.q - H.mod(i.q, 2)) / 2 });
};
export const example = {
  input: { q: 1, r: 2 },
  output: { result: { column: 1, row: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Hex Axial to Odd Column Offset", "hexadecimal", "encoding"],
    collections: ["encode-decode"],
    fields: ["hex", "hexadecimal", "encoding"],
    keywords: ["hexadecimal", "encoding"],
  },
  id: "hex/axial-to-odd-column-offset",
  title: "Hex Axial to Odd Column Offset",
  description:
    "Convert signed integer hex coordinates between axial and odd-column offset convention; floor-compatible parity handles negative coordinates, no geographic projection.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { column: { type: "number" }, row: { type: "number" } },
        required: ["column", "row"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
