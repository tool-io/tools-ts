import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ChromatographyPlateNumberInput = {
  readonly peakWidthMin: number;
  readonly retentionTimeMin: number;
};

export type ChromatographyPlateNumberOutput = {
  readonly plateNumber: number;
};

export const chromatographyPlateNumberExample = {
  input: { retentionTimeMin: 10, peakWidthMin: 0.5 },
  output: { plateNumber: 6400 },
} satisfies ToolExample<
  ChromatographyPlateNumberInput,
  ChromatographyPlateNumberOutput
>;

export const chromatographyPlateNumberTool = createSimpleTool({
  id: "chemistry/chromatography-plate-number",
  title: "Plate Number N",
  description:
    "Compute the theoretical plate number N as sixteen times the square of the ratio of retention time to baseline peak width.",
  inputs: [
    {
      id: "retentionTimeMin",
      label: "Retention time",
      kind: "number",
      unit: "min",
    },
    { id: "peakWidthMin", label: "Peak width", kind: "number", unit: "min" },
  ],
  outputs: [{ id: "plateNumber", label: "Plate number", kind: "number" }],
  calculate: (input) => {
    const retentionTimeMin = input.retentionTimeMin as number;
    const peakWidthMin = input.peakWidthMin as number;
    if (!(retentionTimeMin > 0))
      simpleError(
        "retentionTimeMin",
        "Retention time must be positive.",
        "invalid_times",
      );
    if (!(peakWidthMin > 0))
      simpleError(
        "peakWidthMin",
        "Peak width must be positive.",
        "invalid_width",
      );
    return {
      plateNumber: 16 * Math.pow(retentionTimeMin / peakWidthMin, 2),
    };
  },
});
export const runChromatographyPlateNumber =
  chromatographyPlateNumberTool.execute;
export default chromatographyPlateNumberTool;
