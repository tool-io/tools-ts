import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, points } from "../batch53-shared.js";

export type Input = Readonly<{
  coordinates: readonly (readonly number[])[];
  topPadding: number;
  leftPadding: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "coordinates", label: "Coordinates", kind: "matrix" },
  { id: "topPadding", label: "Top padding", kind: "number" },
  { id: "leftPadding", label: "Left padding", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  points(i.coordinates, 0);
  [i.topPadding, i.leftPadding, ...i.coordinates.flat()].forEach((v) =>
    bounded(v, "coordinate", 0, 1e9),
  );
  return {
    coordinates: i.coordinates.map(([r, c]) => [
      r + i.topPadding,
      c + i.leftPadding,
    ]),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { coordinates: [[0, 1]], topPadding: 2, leftPadding: 3 },
  output: { result: { coordinates: [[2, 4]] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "grid/grid-padding-coordinate-map",
  title: "Grid Padding Coordinate Map",
  description:
    "Translate source grid coordinates after explicit top/left padding; no inferred original or padded dimensions.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
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
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
