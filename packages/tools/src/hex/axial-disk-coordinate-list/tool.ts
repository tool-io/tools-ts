import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ q: number; r: number; radius: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "q", label: "q", kind: "integer" },
  { id: "r", label: "r", kind: "integer" },
  { id: "radius", label: "radius", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.q, -1e9, 1e9);
  H.int(i.r, -1e9, 1e9);
  H.int(i.radius, 0, 6);
  return H.finish({
    coordinates: [
      [i.q, i.r],
      ...Array.from({ length: i.radius }, (_, j) =>
        H.hexRing(i.q, i.r, j + 1),
      ).flat(),
    ],
  });
};
export const example = {
  input: { q: 0, r: 0, radius: 0 },
  output: { result: { coordinates: [[0, 0]] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Hex Axial Disk Coordinate List", "hexadecimal", "encoding"],
    collections: ["encode-decode"],
    fields: ["hex", "hexadecimal", "encoding"],
    keywords: ["hexadecimal", "encoding"],
  },
  id: "hex/axial-disk-coordinate-list",
  title: "Hex Axial Disk Coordinate List",
  description:
    "Enumerate axial hex disk cells center-first then increasing fixed-order rings; radius 0\u20136 yields at most 127 distinct cells.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          coordinates: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
        },
        required: ["coordinates"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
