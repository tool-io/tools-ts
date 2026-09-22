import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly column: number;
  readonly row: number;
  readonly spacingX: number;
  readonly spacingY: number;
  readonly originX: number;
  readonly originY: number;
};
export type Output = { readonly x: number; readonly y: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    column: { type: "integer" },
    row: { type: "integer" },
    spacingX: { type: "number", exclusiveMinimum: 0 },
    spacingY: { type: "number", exclusiveMinimum: 0 },
    originX: { type: "number" },
    originY: { type: "number" },
  },
  required: ["column", "row", "spacingX", "spacingY", "originX", "originY"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { x: { type: "number" }, y: { type: "number" } },
  required: ["x", "y"],
} as const;
/** Map signed grid indices to supplied drawing coordinates without snapping or rounding. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { column, row, spacingX, spacingY, originX, originY } = request;
  const compute = (): Output => {
    H.domain(spacingX > 0 && spacingY > 0);
    return { x: originX + column * spacingX, y: originY + row * spacingY };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    column: 3,
    row: 2,
    spacingX: 5,
    spacingY: 4,
    originX: 1,
    originY: 2,
  },
  output: { x: 16, y: 10 },
} satisfies ToolExample<Input, Output>;
export const drawingGridReferenceOriginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-education/drawing-grid-reference-origin",
    title: "Drawing Grid Reference Origin Tool",
    description:
      "Map signed grid indices to supplied drawing coordinates without snapping or rounding.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        column: { type: "integer" },
        row: { type: "integer" },
        spacingX: { type: "number", exclusiveMinimum: 0 },
        spacingY: { type: "number", exclusiveMinimum: 0 },
        originX: { type: "number" },
        originY: { type: "number" },
      },
      required: ["column", "row", "spacingX", "spacingY", "originX", "originY"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { x: { type: "number" }, y: { type: "number" } },
      required: ["x", "y"],
    },
    ports: {
      inputs: [
        {
          id: "column",
          label: "Column",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "row",
          label: "Row",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "spacingX",
          label: "Spacing X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spacingY",
          label: "Spacing Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "originX",
          label: "Origin X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "originY",
          label: "Origin Y",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "x", label: "X", valueType: { type: "number" } },
        { id: "y", label: "Y", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = drawingGridReferenceOriginTool.execute;
export default drawingGridReferenceOriginTool;
