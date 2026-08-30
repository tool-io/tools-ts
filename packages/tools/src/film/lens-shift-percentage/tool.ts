import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LensShiftPercentageInput = Readonly<{
  readonly verticalOffsetMeters: number;
  readonly imageHeightMeters: number;
}>;
export type LensShiftPercentageOutput = Readonly<{
  readonly shiftPercent: number;
}>;

export const calculateLensShiftPercentage = (
  x: LensShiftPercentageInput,
): LensShiftPercentageOutput => {
  if (!Number.isFinite(x.verticalOffsetMeters))
    simpleError("verticalOffsetMeters", "Provide a finite number.");
  if (!Number.isFinite(x.imageHeightMeters) || x.imageHeightMeters < 0)
    simpleError("imageHeightMeters", "Provide a finite number at least 0.");
  const shiftPercent = (100 * x.verticalOffsetMeters) / x.imageHeightMeters;
  if (!Number.isFinite(shiftPercent))
    simpleError(
      "shiftPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { shiftPercent: Object.is(shiftPercent, -0) ? 0 : shiftPercent };
};

export const example = {
  input: { verticalOffsetMeters: 0.2, imageHeightMeters: 2 },
  output: { shiftPercent: 10 },
} satisfies ToolExample<LensShiftPercentageInput, LensShiftPercentageOutput>;

export const tool = createSimpleTool({
  id: "film/lens-shift-percentage",
  title: "Lens Shift Percentage",
  description:
    "Vertical lens shift as optical-axis offset divided by projected image height, expressed as a signed percentage.",
  inputs: [
    {
      id: "verticalOffsetMeters",
      kind: "number",
      label: "Vertical Offset Meters",
      unit: "m",
    },
    {
      id: "imageHeightMeters",
      kind: "number",
      label: "Image Height Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "shiftPercent", kind: "number", label: "Shift Percent", unit: "%" },
  ],
  calculate: (input) =>
    calculateLensShiftPercentage({
      verticalOffsetMeters: input.verticalOffsetMeters as number,
      imageHeightMeters: input.imageHeightMeters as number,
    }),
});
export const lensShiftPercentageTool = tool;
export const runLensShiftPercentage = tool.execute;
export default tool;
