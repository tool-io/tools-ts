import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SheetLoadJibInput = {
  readonly jibAreaM2: number;
  readonly sheetAngleDeg: number;
  readonly windSpeedMs: number;
};

export type SheetLoadJibOutput = {
  readonly sheetLoadNewtons: number;
};

export const sheetLoadJibExample = {
  input: { jibAreaM2: 10, sheetAngleDeg: 20, windSpeedMs: 8 },
  output: { sheetLoadNewtons: 1375.3575898367162 },
} satisfies ToolExample<SheetLoadJibInput, SheetLoadJibOutput>;

export const calculateSheetLoadJib = (
  input: SheetLoadJibInput,
): SheetLoadJibOutput => {
  if (input.windSpeedMs <= 0)
    simpleError(
      "windSpeedMs",
      "The wind speed must be positive.",
      "invalid_input",
    );
  if (input.jibAreaM2 <= 0)
    simpleError("jibAreaM2", "The jib area must be positive.", "invalid_input");
  if (input.sheetAngleDeg <= 5 || input.sheetAngleDeg >= 90)
    simpleError(
      "sheetAngleDeg",
      "Sheet angle must be greater than 5 and less than 90 degrees.",
      "out_of_range",
    );
  return {
    sheetLoadNewtons:
      (0.5 * 1.225 * input.windSpeedMs ** 2 * input.jibAreaM2 * 1.2) /
      Math.sin((input.sheetAngleDeg * Math.PI) / 180),
  };
};

export const sheetLoadJibTool = createSimpleTool({
  calculate: (input) =>
    calculateSheetLoadJib(input as unknown as SheetLoadJibInput),
  description:
    "Estimate the jib sheet load from dynamic pressure on the sail area divided by the sine of the sheet angle.",
  id: "sailing/sheet-load-jib",
  inputs: [
    {
      description: "Measured area of the jib.",
      format: "area-m2",
      id: "jibAreaM2",
      kind: "number",
      label: "Jib area",
      unit: "m²",
    },
    {
      description:
        "Included angle between sheet and boom at the clew, greater than 5 and less than 90 degrees.",
      id: "sheetAngleDeg",
      kind: "number",
      label: "Sheet angle",
      maximum: 90,
      minimum: 5,
      unit: "deg",
    },
    {
      description: "Apparent wind speed across the sail.",
      format: "speed-ms",
      id: "windSpeedMs",
      kind: "number",
      label: "Wind speed",
      unit: "m/s",
    },
  ],
  outputs: [
    {
      description: "Tension carried by the jib sheet.",
      format: "force",
      id: "sheetLoadNewtons",
      kind: "number",
      label: "Sheet load",
      unit: "N",
    },
  ],
  title: "Jib Sheet Load Calculator",
});
export const runSheetLoadJib = sheetLoadJibTool.execute;
export default sheetLoadJibTool;
