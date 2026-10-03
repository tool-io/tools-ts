import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rows: number;
  readonly columns: number;
  readonly rowSpacing: number;
  readonly columnSpacing: number;
  readonly centerToCenter: boolean;
};
export type Output = {
  readonly height: number;
  readonly width: number;
  readonly area: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rows: { type: "integer", minimum: 1 },
    columns: { type: "integer", minimum: 1 },
    rowSpacing: { type: "number", exclusiveMinimum: 0 },
    columnSpacing: { type: "number", exclusiveMinimum: 0 },
    centerToCenter: { type: "boolean" },
  },
  required: [
    "rows",
    "columns",
    "rowSpacing",
    "columnSpacing",
    "centerToCenter",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    height: { type: "number" },
    width: { type: "number" },
    area: { type: "number" },
  },
  required: ["height", "width", "area"],
} as const;
/** Explicit full pixel-footprint versus first-to-last pixel-center field-of-view convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rows, columns, rowSpacing, columnSpacing, centerToCenter } = request;
  const compute = (): Output => {
    H.integer(rows, 1);
    H.integer(columns, 1);
    H.positive(rowSpacing);
    H.positive(columnSpacing);
    return {
      height: (rows - (centerToCenter ? 1 : 0)) * rowSpacing,
      width: (columns - (centerToCenter ? 1 : 0)) * columnSpacing,
      area:
        (rows - (centerToCenter ? 1 : 0)) *
        rowSpacing *
        (columns - (centerToCenter ? 1 : 0)) *
        columnSpacing,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    rows: 100,
    columns: 200,
    rowSpacing: 0.5,
    columnSpacing: 0.5,
    centerToCenter: false,
  },
  output: { height: 50, width: 100, area: 5000 },
} satisfies ToolExample<Input, Output>;
export const radiologyImageMatrixFieldOfViewFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "radiology/radiology-image-matrix-field-of-view-factor",
      title: "Radiology Image Matrix Field Of View Factor Tool",
      description:
        "Explicit full pixel-footprint versus first-to-last pixel-center field-of-view convention.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          rows: { type: "integer", minimum: 1 },
          columns: { type: "integer", minimum: 1 },
          rowSpacing: { type: "number", exclusiveMinimum: 0 },
          columnSpacing: { type: "number", exclusiveMinimum: 0 },
          centerToCenter: { type: "boolean" },
        },
        required: [
          "rows",
          "columns",
          "rowSpacing",
          "columnSpacing",
          "centerToCenter",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          height: { type: "number" },
          width: { type: "number" },
          area: { type: "number" },
        },
        required: ["height", "width", "area"],
      },
      ports: {
        inputs: [
          {
            id: "rows",
            label: "Rows",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "columns",
            label: "Columns",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "rowSpacing",
            label: "Row Spacing",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "columnSpacing",
            label: "Column Spacing",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "centerToCenter",
            label: "Center To Center",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "height", label: "Height", valueType: { type: "number" } },
          { id: "width", label: "Width", valueType: { type: "number" } },
          { id: "area", label: "Area", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = radiologyImageMatrixFieldOfViewFactorTool.execute;
export default radiologyImageMatrixFieldOfViewFactorTool;
