import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const elisaConcentrationExample = {
  input: { absorbance: 1.5, intercept: 0.5, slope: 0.5 },
  output: { concentrationNgMl: 2 },
} satisfies ToolExample<
  {
    readonly absorbance: number;
    readonly intercept: number;
    readonly slope: number;
  },
  { readonly concentrationNgMl: number }
>;

export const elisaConcentrationTool = createSimpleTool({
  id: "biology/elisa-concentration",
  title: "ELISA Linear Standard Curve",
  description:
    "Interpolate an ELISA sample concentration on a linear standard curve as (absorbance − intercept) / slope. This calculation is only appropriate over a validated linear assay range; it is not a four-parameter logistic fit.",
  inputs: [
    {
      description: "Measured optical density of the sample.",
      id: "absorbance",
      label: "Absorbance",
      kind: "number",
    },
    {
      description:
        "Slope of the linear standard curve; must be greater than zero.",
      id: "slope",
      label: "Slope",
      kind: "number",
    },
    {
      description:
        "Intercept of the linear standard curve at zero concentration; may be any finite value.",
      id: "intercept",
      label: "Intercept",
      kind: "number",
    },
  ],
  outputs: [
    {
      description:
        "Interpolated concentration in nanograms per millilitre; may be negative for below-blank absorbances.",
      id: "concentrationNgMl",
      label: "Concentration",
      kind: "number",
      unit: "ng/mL",
    },
  ],
  calculate: (input) => {
    const absorbance = input.absorbance as number;
    const slope = input.slope as number;
    const intercept = input.intercept as number;
    if (!(slope > 0))
      simpleError(
        "slope",
        "The standard curve slope must be greater than zero.",
        "invalid_slope",
      );
    return { concentrationNgMl: (absorbance - intercept) / slope };
  },
});
export const runElisaConcentration = elisaConcentrationTool.execute;
export default elisaConcentrationTool;
