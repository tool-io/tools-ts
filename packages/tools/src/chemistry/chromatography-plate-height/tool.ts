import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ChromatographyPlateHeightInput = {
  readonly columnLengthMm: number;
  readonly plateNumber: number;
};

export type ChromatographyPlateHeightOutput = {
  readonly plateHeightUm: number;
};

export const chromatographyPlateHeightExample = {
  input: { columnLengthMm: 150, plateNumber: 15000 },
  output: { plateHeightUm: 10 },
} satisfies ToolExample<
  ChromatographyPlateHeightInput,
  ChromatographyPlateHeightOutput
>;

export const chromatographyPlateHeightTool = createSimpleTool({
  id: "chemistry/chromatography-plate-height",
  title: "Plate Height H",
  description:
    "Compute the plate height H in micrometers as the column length converted to micrometers divided by the plate number.",
  inputs: [
    {
      id: "columnLengthMm",
      label: "Column length",
      kind: "number",
      unit: "mm",
    },
    { id: "plateNumber", label: "Plate number", kind: "number", minimum: 1 },
  ],
  outputs: [
    { id: "plateHeightUm", label: "Plate height", kind: "number", unit: "µm" },
  ],
  calculate: (input) => {
    const columnLengthMm = input.columnLengthMm as number;
    const plateNumber = input.plateNumber as number;
    if (!(columnLengthMm > 0))
      simpleError(
        "columnLengthMm",
        "Column length must be positive.",
        "invalid_length",
      );
    if (!(plateNumber > 0))
      simpleError(
        "plateNumber",
        "Plate number must be positive.",
        "invalid_plates",
      );
    return { plateHeightUm: (columnLengthMm * 1000) / plateNumber };
  },
});
export const runChromatographyPlateHeight =
  chromatographyPlateHeightTool.execute;
export default chromatographyPlateHeightTool;
