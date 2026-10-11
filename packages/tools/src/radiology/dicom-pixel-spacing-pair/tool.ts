import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rowSpacingMillimeters: number;
  readonly columnSpacingMillimeters: number;
};
export type Output = {
  readonly dicomValue: string;
  readonly pixelAreaSquareMillimeters: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rowSpacingMillimeters: { type: "number", minimum: 0 },
    columnSpacingMillimeters: { type: "number", minimum: 0 },
  },
  required: ["rowSpacingMillimeters", "columnSpacingMillimeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dicomValue: { type: "string", maxLength: 8192 },
    pixelAreaSquareMillimeters: { type: "number" },
  },
  required: ["dicomValue", "pixelAreaSquareMillimeters"],
} as const;
/** Format nonnegative DICOM row-then-column pixel spacing with a backslash separator and return in-plane area; image dimensions and the single-pixel exception for zero spacing remain caller-supplied context. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rowSpacingMillimeters, columnSpacingMillimeters } = request;
  const compute = (): Output => {
    H.domain(
      rowSpacingMillimeters >= 0 && columnSpacingMillimeters >= 0,
      "rowSpacingMillimeters",
    );
    H.domain(
      String(rowSpacingMillimeters).length <= 16,
      "rowSpacingMillimeters",
      "The unrounded decimal string exceeds the DICOM DS length limit.",
    );
    H.domain(
      String(columnSpacingMillimeters).length <= 16,
      "columnSpacingMillimeters",
      "The unrounded decimal string exceeds the DICOM DS length limit.",
    );
    return {
      dicomValue: rowSpacingMillimeters + "\\" + columnSpacingMillimeters,
      pixelAreaSquareMillimeters:
        rowSpacingMillimeters * columnSpacingMillimeters,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rowSpacingMillimeters: 0.5, columnSpacingMillimeters: 0.8 },
  output: { dicomValue: "0.5\\0.8", pixelAreaSquareMillimeters: 0.4 },
} satisfies ToolExample<Input, Output>;
export const dicomPixelSpacingPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["radiology", "health and medicine"],
      keywords: ["radiology", "health and medicine"],
    },
    id: "radiology/dicom-pixel-spacing-pair",
    title: "DICOM Pixel Spacing Pair",
    description:
      "Format nonnegative DICOM row-then-column pixel spacing with a backslash separator and return in-plane area; image dimensions and the single-pixel exception for zero spacing remain caller-supplied context.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rowSpacingMillimeters: { type: "number", minimum: 0 },
        columnSpacingMillimeters: { type: "number", minimum: 0 },
      },
      required: ["rowSpacingMillimeters", "columnSpacingMillimeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dicomValue: { type: "string", maxLength: 8192 },
        pixelAreaSquareMillimeters: { type: "number" },
      },
      required: ["dicomValue", "pixelAreaSquareMillimeters"],
    },
    ports: {
      inputs: [
        {
          id: "rowSpacingMillimeters",
          label: "Row Spacing Millimeters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "columnSpacingMillimeters",
          label: "Column Spacing Millimeters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "dicomValue",
          label: "Dicom Value",
          valueType: { type: "string" },
        },
        {
          id: "pixelAreaSquareMillimeters",
          label: "Pixel Area Square Millimeters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dicomPixelSpacingPairTool.execute;
export default dicomPixelSpacingPairTool;
