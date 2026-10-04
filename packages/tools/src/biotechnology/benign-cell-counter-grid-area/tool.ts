import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gridWidthMillimeters: number;
  readonly gridHeightMillimeters: number;
  readonly gridCount: number;
};
export type Output = { readonly totalAreaSquareMillimeters: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gridWidthMillimeters: { type: "number", exclusiveMinimum: 0 },
    gridHeightMillimeters: { type: "number", exclusiveMinimum: 0 },
    gridCount: { type: "integer", minimum: 0 },
  },
  required: ["gridWidthMillimeters", "gridHeightMillimeters", "gridCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { totalAreaSquareMillimeters: { type: "number" } },
  required: ["totalAreaSquareMillimeters"],
} as const;
/** Sum the area of identical nonoverlapping rectangular image-counting grids. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gridWidthMillimeters, gridHeightMillimeters, gridCount } = request;
  const compute = (): Output => {
    (H.domain(gridWidthMillimeters > 0, "gridWidthMillimeters"),
      gridWidthMillimeters);
    (H.domain(gridHeightMillimeters > 0, "gridHeightMillimeters"),
      gridHeightMillimeters);
    (H.domain(
      Number.isSafeInteger(gridCount) &&
        gridCount >= 0 &&
        gridCount <= Number.MAX_SAFE_INTEGER,
      "gridCount",
    ),
      gridCount);
    return {
      totalAreaSquareMillimeters:
        gridWidthMillimeters * gridHeightMillimeters * gridCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    gridWidthMillimeters: 0.2,
    gridHeightMillimeters: 0.2,
    gridCount: 25,
  },
  output: { totalAreaSquareMillimeters: 1.0000000000000002 },
} satisfies ToolExample<Input, Output>;
export const benignCellCounterGridAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biotechnology/benign-cell-counter-grid-area",
    title: "Benign Cell Counter Grid Area Tool",
    description:
      "Sum the area of identical nonoverlapping rectangular image-counting grids.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gridWidthMillimeters: { type: "number", exclusiveMinimum: 0 },
        gridHeightMillimeters: { type: "number", exclusiveMinimum: 0 },
        gridCount: { type: "integer", minimum: 0 },
      },
      required: ["gridWidthMillimeters", "gridHeightMillimeters", "gridCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { totalAreaSquareMillimeters: { type: "number" } },
      required: ["totalAreaSquareMillimeters"],
    },
    ports: {
      inputs: [
        {
          id: "gridWidthMillimeters",
          label: "Grid Width Millimeters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gridHeightMillimeters",
          label: "Grid Height Millimeters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gridCount",
          label: "Grid Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "totalAreaSquareMillimeters",
          label: "Total Area Square Millimeters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = benignCellCounterGridAreaTool.execute;
export default benignCellCounterGridAreaTool;
