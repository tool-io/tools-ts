import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ ring: readonly (readonly number[])[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "ring", label: "Ring", kind: "matrix" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.ring.length > 0 && i.ring.every((p) => p.length === 2 || p.length === 3),
  );
  return H.finish({
    first: i.ring[0],
    last: i.ring[i.ring.length - 1],
    closed: H.equal(i.ring[0], i.ring[i.ring.length - 1]),
  });
};
export const example = {
  input: {
    ring: [
      [0, 0],
      [1, 1],
      [0, 0],
    ],
  },
  output: { result: { first: [0, 0], last: [0, 0], closed: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geojson/polygon-ring-start-end-pair",
  title: "GeoJSON: Polygon Ring Start End Pair Tool",
  description:
    "Extract the exact first/last position pair of one nonempty candidate GeoJSON ring and report equality without repairing or claiming full ring validity.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          closed: { type: "boolean" },
          first: { type: "array", items: { type: "number" } },
          last: { type: "array", items: { type: "number" } },
        },
        required: ["closed", "first", "last"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
