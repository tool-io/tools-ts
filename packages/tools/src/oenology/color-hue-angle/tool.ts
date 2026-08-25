import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type ColorHueAngleInput = {
  readonly absorbance420: number;
  readonly absorbance520: number;
};

export type ColorHueAngleOutput = {
  readonly hueRatio: number;
};

export const colorHueAngleExample = {
  input: {
    absorbance420: 0.9,
    absorbance520: 1.8,
  },
  output: {
    hueRatio: 0.5,
  },
} satisfies ToolExample<ColorHueAngleInput, ColorHueAngleOutput>;

export const calculateColorHueAngle = (
  input: ColorHueAngleInput,
): ColorHueAngleOutput => {
  if (input.absorbance520 <= 0)
    simpleError(
      "absorbance520",
      "The 520 nanometer absorbance must be positive to form a hue ratio.",
      "invalid_value",
    );
  return {
    hueRatio: roundStatistic(input.absorbance420 / input.absorbance520),
  };
};

export const colorHueAngleTool = createSimpleTool({
  calculate: (input) =>
    calculateColorHueAngle(input as unknown as ColorHueAngleInput),
  description:
    "Compute the conventional red-wine hue ratio A420/A520 from spectrophotometer absorbances; despite the legacy route name, the result is a dimensionless ratio rather than an angle.",
  id: "oenology/color-hue-angle",
  inputs: [
    {
      description: "Absorbance at 420 nanometers, the browning end.",
      id: "absorbance420",
      kind: "number",
      label: "A420",
      minimum: 0,
    },
    {
      description: "Absorbance at 520 nanometers.",
      id: "absorbance520",
      kind: "number",
      label: "A520",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Dimensionless A420 divided by A520.",
      id: "hueRatio",
      kind: "number",
      label: "Hue ratio",
    },
  ],
  title: "Wine Color Hue Ratio Calculator",
});
export const runColorHueAngle = colorHueAngleTool.execute;
export default colorHueAngleTool;
