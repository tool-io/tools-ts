import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type AnthocyaninColorDensityInput = {
  readonly absorbance420: number;
  readonly absorbance520: number;
};

export type AnthocyaninColorDensityOutput = {
  readonly colorDensity: number;
  readonly hueRatio: number;
};

export const anthocyaninColorDensityExample = {
  input: {
    absorbance420: 0.9,
    absorbance520: 1.8,
  },
  output: {
    colorDensity: 2.7,
    hueRatio: 0.5,
  },
} satisfies ToolExample<
  AnthocyaninColorDensityInput,
  AnthocyaninColorDensityOutput
>;

export const calculateAnthocyaninColorDensity = (
  input: AnthocyaninColorDensityInput,
): AnthocyaninColorDensityOutput => {
  if (input.absorbance520 <= 0)
    simpleError(
      "absorbance520",
      "The 520 nanometer absorbance must be positive to form a hue ratio.",
      "invalid_value",
    );
  return {
    colorDensity: roundStatistic(input.absorbance420 + input.absorbance520),
    hueRatio: roundStatistic(input.absorbance420 / input.absorbance520),
  };
};

export const anthocyaninColorDensityTool = createSimpleTool({
  calculate: (input) =>
    calculateAnthocyaninColorDensity(
      input as unknown as AnthocyaninColorDensityInput,
    ),
  description:
    "Calculate the conventional two-wavelength wine color density (A420 + A520) and hue ratio (A420/A520); these optical indices do not directly measure anthocyanin concentration.",
  id: "oenology/anthocyanin-color-density",
  inputs: [
    {
      description: "Absorbance at 420 nanometers.",
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
      description: "Total color intensity of the wine.",
      id: "colorDensity",
      kind: "number",
      label: "Color density",
    },
    {
      description: "A420 over A520 shade indicator.",
      id: "hueRatio",
      kind: "number",
      label: "Hue ratio",
    },
  ],
  title: "Wine Color Density and Hue Calculator",
});
export const runAnthocyaninColorDensity = anthocyaninColorDensityTool.execute;
export default anthocyaninColorDensityTool;
