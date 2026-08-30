import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive } from "../shared.js";

export type Input = Readonly<{
  readonly seeingFwhmArcseconds: number;
  readonly xPixelScaleArcseconds: number;
  readonly yPixelScaleArcseconds: number;
  readonly minimumPixelsPerFwhm: number;
}>;
export type Output = Readonly<{
  readonly xFwhmPixels: number;
  readonly yFwhmPixels: number;
  readonly adequatelySampledBothAxes: boolean;
}>;
export const calculate = (input: Input): Output => {
  positive(input.seeingFwhmArcseconds, "seeingFwhmArcseconds");
  positive(input.xPixelScaleArcseconds, "xPixelScaleArcseconds");
  positive(input.yPixelScaleArcseconds, "yPixelScaleArcseconds");
  positive(input.minimumPixelsPerFwhm, "minimumPixelsPerFwhm");
  const xFwhmPixels = input.seeingFwhmArcseconds / input.xPixelScaleArcseconds,
    yFwhmPixels = input.seeingFwhmArcseconds / input.yPixelScaleArcseconds;
  return {
    xFwhmPixels,
    yFwhmPixels,
    adequatelySampledBothAxes:
      Math.min(xFwhmPixels, yFwhmPixels) >= input.minimumPixelsPerFwhm,
  };
};
export const exampleInput = {
  seeingFwhmArcseconds: 1,
  xPixelScaleArcseconds: 0.4,
  yPixelScaleArcseconds: 0.6,
  minimumPixelsPerFwhm: 2,
} satisfies Input;
export const exampleOutput = {
  xFwhmPixels: 2.5,
  yFwhmPixels: 1.6666666666666667,
  adequatelySampledBothAxes: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/anisotropic-psf-sampling",
  title: "Anisotropic Psf Sampling",
  description:
    "Screen measured PSF FWHM sampling independently along both pixel axes using a supplied minimum; the two-pixel heuristic is not an exact Gaussian bandlimit.",
  inputs: [
    {
      id: "seeingFwhmArcseconds",
      label: "Seeing fwhm arcseconds",
      kind: "number",
    },
    {
      id: "xPixelScaleArcseconds",
      label: "X pixel scale arcseconds",
      kind: "number",
    },
    {
      id: "yPixelScaleArcseconds",
      label: "Y pixel scale arcseconds",
      kind: "number",
    },
    {
      id: "minimumPixelsPerFwhm",
      label: "Minimum pixels per fwhm",
      kind: "number",
    },
  ],
  outputs: [
    { id: "xFwhmPixels", label: "X fwhm pixels", kind: "number" },
    { id: "yFwhmPixels", label: "Y fwhm pixels", kind: "number" },
    {
      id: "adequatelySampledBothAxes",
      label: "Adequately sampled both axes",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      seeingFwhmArcseconds: value.seeingFwhmArcseconds as number,
      xPixelScaleArcseconds: value.xPixelScaleArcseconds as number,
      yPixelScaleArcseconds: value.yPixelScaleArcseconds as number,
      minimumPixelsPerFwhm: value.minimumPixelsPerFwhm as number,
    }),
});
export const run = tool.execute;
export default tool;
