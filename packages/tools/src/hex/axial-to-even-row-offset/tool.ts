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
  return H.finish({ column: i.q + (i.r + H.mod(i.r, 2)) / 2, row: i.r });
};
export const example = {
  input: { q: 2, r: 1 },
  output: { result: { column: 3, row: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Hex Axial to Even Row Offset", "hexadecimal", "encoding"],
    collections: ["encode-decode"],
    fields: ["hex", "hexadecimal", "encoding"],
    keywords: ["hexadecimal", "encoding"],
  },
  id: "hex/axial-to-even-row-offset",
  title: "Hex Axial to Even Row Offset",
  description:
    "Convert signed integer hex coordinates between axial and even-row offset convention; floor-compatible parity handles negative coordinates, no geographic projection.",
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
