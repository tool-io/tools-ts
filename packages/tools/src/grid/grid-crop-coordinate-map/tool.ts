import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, points } from "../batch53-shared.js";

export type Input = Readonly<{
  coordinates: readonly (readonly number[])[];
  cropTop: number;
  cropLeft: number;
  cropRows: number;
  cropColumns: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "coordinates", label: "Coordinates", kind: "matrix" },
  { id: "cropTop", label: "Crop top", kind: "number" },
  { id: "cropLeft", label: "Crop left", kind: "number" },
  { id: "cropRows", label: "Crop rows", kind: "number" },
  { id: "cropColumns", label: "Crop columns", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  points(i.coordinates, 0);
  [i.cropTop, i.cropLeft].forEach((v) => bounded(v, "origin", 0, 1e9));
  [i.cropRows, i.cropColumns].forEach((v) => bounded(v, "size", 1, 1e9));
  i.coordinates.flat().forEach((v) => bounded(v, "coordinate", 0, 1e9));
  return {
    mapping: i.coordinates.map(([r, c]) => {
      const row = r - i.cropTop,
        column = c - i.cropLeft,
        inside =
          row >= 0 && column >= 0 && row < i.cropRows && column < i.cropColumns;
      return {
        inside,
        row: inside ? row : null,
        column: inside ? column : null,
      };
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    coordinates: [
      [2, 3],
      [0, 0],
    ],
    cropTop: 1,
    cropLeft: 2,
    cropRows: 3,
    cropColumns: 3,
  },
  output: {
    result: {
      mapping: [
        { inside: true, row: 1, column: 1 },
        { inside: false, row: null, column: null },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "grid/grid-crop-coordinate-map",
  title: "Grid Crop Coordinate Map",
  description:
    "Map source grid coordinates into a half-open crop and retain excluded-coordinate evidence instead of silently clipping.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
