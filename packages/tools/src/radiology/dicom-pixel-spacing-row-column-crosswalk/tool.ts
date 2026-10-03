import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rowOffset: number;
  readonly columnOffset: number;
  readonly pixelSpacing: readonly number[];
};
export type Output = {
  readonly rowDistanceMm: number;
  readonly columnDistanceMm: number;
  readonly planarDistanceMm: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rowOffset: { type: "number" },
    columnOffset: { type: "number" },
    pixelSpacing: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["rowOffset", "columnOffset", "pixelSpacing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rowDistanceMm: { type: "number" },
    columnDistanceMm: { type: "number" },
    planarDistanceMm: { type: "number" },
  },
  required: ["rowDistanceMm", "columnDistanceMm", "planarDistanceMm"],
} as const;
/** DICOM Pixel Spacing order is row then column, in millimeters; distances are in the image plane, not patient-coordinate reconstruction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rowOffset, columnOffset, pixelSpacing } = request;
  const compute = (): Output => {
    H.domain(pixelSpacing.length === 2 && pixelSpacing.every((x) => x > 0));
    return {
      rowDistanceMm: rowOffset * pixelSpacing[0],
      columnDistanceMm: columnOffset * pixelSpacing[1],
      planarDistanceMm: Math.hypot(
        rowOffset * pixelSpacing[0],
        columnOffset * pixelSpacing[1],
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rowOffset: 3, columnOffset: 4, pixelSpacing: [2, 1] },
  output: {
    rowDistanceMm: 6,
    columnDistanceMm: 4,
    planarDistanceMm: 7.211102550927979,
  },
} satisfies ToolExample<Input, Output>;
export const dicomPixelSpacingRowColumnCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "radiology/dicom-pixel-spacing-row-column-crosswalk",
      title: "DICOM Pixel Spacing Row Column Crosswalk Tool",
      description:
        "DICOM Pixel Spacing order is row then column, in millimeters; distances are in the image plane, not patient-coordinate reconstruction.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          rowOffset: { type: "number" },
          columnOffset: { type: "number" },
          pixelSpacing: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["rowOffset", "columnOffset", "pixelSpacing"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          rowDistanceMm: { type: "number" },
          columnDistanceMm: { type: "number" },
          planarDistanceMm: { type: "number" },
        },
        required: ["rowDistanceMm", "columnDistanceMm", "planarDistanceMm"],
      },
      ports: {
        inputs: [
          {
            id: "rowOffset",
            label: "Row Offset",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "columnOffset",
            label: "Column Offset",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "pixelSpacing",
            label: "Pixel Spacing",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "rowDistanceMm",
            label: "Row Distance Mm",
            valueType: { type: "number" },
          },
          {
            id: "columnDistanceMm",
            label: "Column Distance Mm",
            valueType: { type: "number" },
          },
          {
            id: "planarDistanceMm",
            label: "Planar Distance Mm",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = dicomPixelSpacingRowColumnCrosswalkTool.execute;
export default dicomPixelSpacingRowColumnCrosswalkTool;
