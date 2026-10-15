import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  points: readonly (readonly number[])[];
  repeatedClosureAllowed: boolean;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "points", label: "points", kind: "matrix" },
  {
    id: "repeatedClosureAllowed",
    label: "repeatedClosureAllowed",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  i.points.forEach(H.point);
  const closed =
      i.points.length > 1 &&
      i.points[0].every((x, j) => x === i.points.at(-1)![j]),
    p = closed && i.repeatedClosureAllowed ? i.points.slice(0, -1) : i.points;
  return H.finish({
    duplicates: H.duplicates(p, (v) => JSON.stringify(v)),
    explicitClosure: closed,
  });
};
export const example = {
  input: {
    points: [
      [0, 0],
      [1, 0],
      [0, 0],
    ],
    repeatedClosureAllowed: true,
  },
  output: { result: { duplicates: [], explicitClosure: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Polygon Repeated Vertex Audit", "mathematics"],
    collections: ["data", "learn"],
    fields: ["geometry", "mathematics"],
    keywords: ["mathematics"],
  },
  id: "geometry/polygon-repeated-vertex-audit",
  title: "Polygon Repeated Vertex Audit",
  description:
    "Audit exact repeated polygon coordinates with an explicit allowance for one repeated closure point; interior repetition remains observable.",
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
          duplicates: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                key: { type: "string" },
                indexes: { type: "array", items: { type: "number" } },
              },
              required: ["key", "indexes"],
            },
          },
          explicitClosure: { type: "boolean" },
        },
        required: ["duplicates", "explicitClosure"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
