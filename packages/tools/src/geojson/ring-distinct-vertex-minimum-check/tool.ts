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
    i.ring.every(
      (p) =>
        p.length === 2 &&
        p[0] >= -180 &&
        p[0] <= 180 &&
        p[1] >= -90 &&
        p[1] <= 90,
    ),
  );
  const closed =
      i.ring.length > 1 && H.equal(i.ring[0], i.ring[i.ring.length - 1]),
    unique = new Set(i.ring.map((p) => JSON.stringify(p))).size;
  return H.finish({
    closed,
    distinctVertices: unique,
    minimumSatisfied: closed && i.ring.length >= 4 && unique >= 3,
  });
};
export const example = {
  input: {
    ring: [
      [0, 0],
      [1, 0],
      [0, 1],
      [0, 0],
    ],
  },
  output: {
    result: { closed: true, distinctVertices: 3, minimumSatisfied: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geojson/ring-distinct-vertex-minimum-check",
  title: "GeoJSON: Ring Distinct Vertex Minimum Check Tool",
  description:
    "Check only the RFC7946 closed linear-ring minimum of four positions and three distinct vertices; no simplicity, winding or polygon validity claim.",
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
          distinctVertices: { type: "number" },
          minimumSatisfied: { type: "boolean" },
        },
        required: ["closed", "distinctVertices", "minimumSatisfied"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
