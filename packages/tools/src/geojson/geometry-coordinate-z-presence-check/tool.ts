import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ position: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "position", label: "Position", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.position.length === 2 || i.position.length === 3);
  H.bounded(i.position[0], -180, 180);
  H.bounded(i.position[1], -90, 90);
  return H.finish({ hasZ: i.position.length === 3 });
};
export const example = {
  input: { position: [1, 2, 3] },
  output: { result: { hasZ: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geojson/geometry-coordinate-z-presence-check",
  title: "GeoJSON: Geometry Coordinate Z Presence Check Tool",
  description:
    "Check whether one RFC7946-style position has a third altitude coordinate, rejecting ambiguous extra dimensions; not an altitude-datum validator.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { hasZ: { type: "boolean" } },
        required: ["hasZ"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
