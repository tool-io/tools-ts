import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly row: number;
  readonly column: number;
  readonly cropTop: number;
  readonly cropLeft: number;
  readonly rows: number;
  readonly columns: number;
};
export type Output = {
  readonly croppedRow: number;
  readonly croppedColumn: number;
  readonly inside: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    row: { type: "integer", minimum: 0 },
    column: { type: "integer", minimum: 0 },
    cropTop: { type: "integer", minimum: 0 },
    cropLeft: { type: "integer", minimum: 0 },
    rows: { type: "integer", minimum: 1 },
    columns: { type: "integer", minimum: 1 },
  },
  required: ["row", "column", "cropTop", "cropLeft", "rows", "columns"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    croppedRow: { type: "integer" },
    croppedColumn: { type: "integer" },
    inside: { type: "boolean" },
  },
  required: ["croppedRow", "croppedColumn", "inside"],
} as const;
/** Zero-based raster crop-origin translation with half-open bounds, not a patient-coordinate transform. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { row, column, cropTop, cropLeft, rows, columns } = request;
  const compute = (): Output => {
    H.integer(rows, 1);
    H.integer(columns, 1);
    H.integer(row, 0);
    H.integer(column, 0);
    H.integer(cropTop, 0);
    H.integer(cropLeft, 0);
    return {
      croppedRow: row - cropTop,
      croppedColumn: column - cropLeft,
      inside:
        row >= cropTop &&
        row < cropTop + rows &&
        column >= cropLeft &&
        column < cropLeft + columns,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    row: 15,
    column: 25,
    cropTop: 10,
    cropLeft: 20,
    rows: 50,
    columns: 60,
  },
  output: { croppedRow: 5, croppedColumn: 5, inside: true },
} satisfies ToolExample<Input, Output>;
export const radiologyImageCropOriginShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "radiology/radiology-image-crop-origin-shift",
    title: "Radiology Image Crop Origin Shift Tool",
    description:
      "Zero-based raster crop-origin translation with half-open bounds, not a patient-coordinate transform.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        row: { type: "integer", minimum: 0 },
        column: { type: "integer", minimum: 0 },
        cropTop: { type: "integer", minimum: 0 },
        cropLeft: { type: "integer", minimum: 0 },
        rows: { type: "integer", minimum: 1 },
        columns: { type: "integer", minimum: 1 },
      },
      required: ["row", "column", "cropTop", "cropLeft", "rows", "columns"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        croppedRow: { type: "integer" },
        croppedColumn: { type: "integer" },
        inside: { type: "boolean" },
      },
      required: ["croppedRow", "croppedColumn", "inside"],
    },
    ports: {
      inputs: [
        {
          id: "row",
          label: "Row",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "column",
          label: "Column",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "cropTop",
          label: "Crop Top",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "cropLeft",
          label: "Crop Left",
          required: true,
          valueType: { type: "integer" },
        },
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
      ],
      outputs: [
        {
          id: "croppedRow",
          label: "Cropped Row",
          valueType: { type: "integer" },
        },
        {
          id: "croppedColumn",
          label: "Cropped Column",
          valueType: { type: "integer" },
        },
        { id: "inside", label: "Inside", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = radiologyImageCropOriginShiftTool.execute;
export default radiologyImageCropOriginShiftTool;
