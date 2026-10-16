import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  point: readonly number[];
  size: number;
  pointy: boolean;
  origin: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "point", label: "point", kind: "numberList" },
  { id: "size", label: "size", kind: "number" },
  { id: "pointy", label: "pointy", kind: "boolean" },
  { id: "origin", label: "origin", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.positive(i.size);
  H.point(i.point);
  H.point(i.origin);
  const x = i.point[0] - i.origin[0],
    y = i.point[1] - i.origin[1];
  return H.finish({
    q: i.pointy
      ? ((Math.sqrt(3) * x) / 3 - y / 3) / i.size
      : (2 * x) / 3 / i.size,
    r: i.pointy
      ? (2 * y) / 3 / i.size
      : (-x / 3 + (Math.sqrt(3) * y) / 3) / i.size,
  });
};
export const example = {
  input: { point: [3, 4], size: 2, pointy: true, origin: [3, 4] },
  output: { result: { q: 0, r: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Hex Pixel to Fractional Axial Record",
      "hexadecimal",
      "encoding",
    ],
    collections: ["encode-decode"],
    fields: ["hex", "hexadecimal", "encoding"],
    keywords: ["hexadecimal", "encoding"],
  },
  id: "hex/pixel-to-fractional-axial-record",
  title: "Hex Pixel to Fractional Axial Record",
  description:
    "Invert explicit hex-center pixel mapping to fractional axial coordinates without rounding to a cell; caller supplies orientation, circumradius and origin.",
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
