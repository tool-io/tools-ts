import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CropFactorFocalLengthInput = Readonly<{
  readonly actualFocalMillimeters: number;
  readonly cropFactor: number;
}>;
export type CropFactorFocalLengthOutput = Readonly<{
  readonly equivalentFocalMillimeters: number;
}>;

export const calculateCropFactorFocalLength = (
  x: CropFactorFocalLengthInput,
): CropFactorFocalLengthOutput => {
  if (
    !Number.isFinite(x.actualFocalMillimeters) ||
    x.actualFocalMillimeters < 0
  )
    simpleError(
      "actualFocalMillimeters",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.cropFactor) || x.cropFactor < 0)
    simpleError("cropFactor", "Provide a finite number at least 0.");
  const equivalentFocalMillimeters = x.actualFocalMillimeters * x.cropFactor;
  if (!Number.isFinite(equivalentFocalMillimeters))
    simpleError(
      "equivalentFocalMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    equivalentFocalMillimeters: Object.is(equivalentFocalMillimeters, -0)
      ? 0
      : equivalentFocalMillimeters,
  };
};

export const example = {
  input: { actualFocalMillimeters: 50, cropFactor: 1.5 },
  output: { equivalentFocalMillimeters: 75 },
} satisfies ToolExample<
  CropFactorFocalLengthInput,
  CropFactorFocalLengthOutput
>;

export const tool = createSimpleTool({
  id: "film/crop-factor-focal-length",
  title: "Crop Factor Focal Length",
  description:
    "Equivalent field-of-view focal length from an actual focal length times a supplied crop factor.",
  inputs: [
    {
      id: "actualFocalMillimeters",
      kind: "number",
      label: "Actual Focal Millimeters",
      unit: "mm",
      minimum: 0,
    },
    { id: "cropFactor", kind: "number", label: "Crop Factor", minimum: 0 },
  ],
  outputs: [
    {
      id: "equivalentFocalMillimeters",
      kind: "number",
      label: "Equivalent Focal Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateCropFactorFocalLength({
      actualFocalMillimeters: input.actualFocalMillimeters as number,
      cropFactor: input.cropFactor as number,
    }),
});
export const cropFactorFocalLengthTool = tool;
export const runCropFactorFocalLength = tool.execute;
export default tool;
