import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WorkpieceWeightInput = {
  readonly densityKgPerCbm: number;
  readonly heightMm: number;
  readonly lengthMm: number;
  readonly widthMm: number;
};

export type WorkpieceWeightOutput = {
  readonly weightKg: number;
};

export const workpieceWeightExample = {
  input: { densityKgPerCbm: 650, heightMm: 19, lengthMm: 2000, widthMm: 600 },
  output: { weightKg: 14.82 },
} satisfies ToolExample<WorkpieceWeightInput, WorkpieceWeightOutput>;

export const workpieceWeightTool = createSimpleTool({
  id: "carpentry/werkstueck-gewicht-aus-rohdichte",
  title: "Workpiece Weight Calculator",
  description:
    "Compute workpiece weight in kilograms from raw wood density and millimetre dimensions.",
  inputs: [
    {
      description:
        "Raw density in kilograms per cubic metre, between 100 and 1400.",
      id: "densityKgPerCbm",
      kind: "number",
      label: "Raw density",
      maximum: 1400,
      minimum: 100,
      unit: "kg/m³",
    },
    {
      description: "Length of the workpiece in millimetres.",
      id: "lengthMm",
      kind: "number",
      label: "Length",
      unit: "mm",
    },
    {
      description: "Width of the workpiece in millimetres.",
      id: "widthMm",
      kind: "number",
      label: "Width",
      unit: "mm",
    },
    {
      description: "Thickness of the workpiece in millimetres.",
      id: "heightMm",
      kind: "number",
      label: "Thickness",
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Weight of the rectangular workpiece in kilograms.",
      format: "mass",
      id: "weightKg",
      kind: "number",
      label: "Weight",
      unit: "kg",
    },
  ],
  calculate: (input) => {
    const lengthMm = input.lengthMm as number;
    if (lengthMm <= 0)
      simpleError(
        "lengthMm",
        "The length must be greater than zero millimetres.",
        "invalid_length",
      );
    const widthMm = input.widthMm as number;
    if (widthMm <= 0)
      simpleError(
        "widthMm",
        "The width must be greater than zero millimetres.",
        "invalid_width",
      );
    const heightMm = input.heightMm as number;
    if (heightMm <= 0)
      simpleError(
        "heightMm",
        "The thickness must be greater than zero millimetres.",
        "invalid_height",
      );
    return {
      weightKg:
        ((input.densityKgPerCbm as number) * (lengthMm * widthMm * heightMm)) /
        1e9,
    };
  },
});
export const runWorkpieceWeight = workpieceWeightTool.execute;
export default workpieceWeightTool;
