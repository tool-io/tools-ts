import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch41-shared.js";
export type Input = Readonly<{ readonly gaussianFwhmArcsec: number }>;
export type Output = Readonly<{ readonly gaussianSigmaArcsec: number }>;
const inputFields = [
  { id: "gaussianFwhmArcsec", label: "Gaussian fwhm arcsec", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.gaussianFwhmArcsec, "gaussianFwhmArcsec");
  return {
    gaussianSigmaArcsec:
      input.gaussianFwhmArcsec / (2 * Math.sqrt(2 * Math.log(2))),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  gaussianFwhmArcsec: 2.3548200450309493,
} satisfies Input;
export const exampleOutput = { gaussianSigmaArcsec: 1 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/seeing-fwhm-gaussian-sigma-converter",
  title: "Seeing FWHM arcsec to Gaussian Sigma Converter",
  description:
    "Exact Gaussian FWHM=2 sqrt(2 ln 2)σconversion, not Moffat PSF or actual seeing Gaussian fit. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "gaussianSigmaArcsec",
      label: "Gaussian sigma arcsec",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({ gaussianFwhmArcsec: value.gaussianFwhmArcsec as number }),
});
export const run = tool.execute;
export default tool;
