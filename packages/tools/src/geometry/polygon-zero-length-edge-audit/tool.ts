import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ points: readonly (readonly number[])[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "points", label: "points", kind: "matrix" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  i.points.forEach(H.point);
  return H.finish({
    edges: i.points.flatMap((p, j) =>
      p.every((x, k) => x === i.points[(j + 1) % i.points.length][k])
        ? [j]
        : [],
    ),
  });
};
export const example = {
  input: {
    points: [
      [0, 0],
      [1, 0],
      [1, 0],
    ],
  },
  output: { result: { edges: [1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Polygon Zero Length Edge Audit", "mathematics"],
    collections: ["data", "learn"],
    fields: ["geometry", "mathematics"],
    keywords: ["mathematics"],
  },
  id: "geometry/polygon-zero-length-edge-audit",
  title: "Polygon Zero Length Edge Audit",
  description:
    "Identify exactly zero-length edges in an implicitly closed polygon coordinate cycle; explicit repeated closure creates a zero closing edge.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { edges: { type: "array", items: { type: "number" } } },
        required: ["edges"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
