import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly trailArcseconds: number;
  readonly seeingFwhmArcseconds: number;
  readonly lossCoefficient: number;
}>;
export type Output = Readonly<{
  readonly magnitudeLoss: number;
  readonly relativeSignalToNoise: number;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.trailArcseconds, "trailArcseconds");
  positive(input.seeingFwhmArcseconds, "seeingFwhmArcseconds");
  nonnegative(input.lossCoefficient, "lossCoefficient");
  const factor =
    1 +
    input.lossCoefficient *
      (input.trailArcseconds / input.seeingFwhmArcseconds) ** 2;
  return {
    magnitudeLoss: 1.25 * Math.log10(factor),
    relativeSignalToNoise: 1 / Math.sqrt(factor),
  };
};
export const exampleInput = {
  trailArcseconds: 1,
  seeingFwhmArcseconds: 1,
  lossCoefficient: 0.42,
} satisfies Input;
export const exampleOutput = {
  magnitudeLoss: 0.1903604304788206,
  relativeSignalToNoise: 0.8391813582966892,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/parametric-trailing-loss",
  title: "Parametric Trailing Loss",
  description:
    "Evaluate an explicitly supplied quadratic trailing-loss model coefficient; this is a matched-filter SNR approximation, not an aperture-flux correction.",
  inputs: [
    { id: "trailArcseconds", label: "Trail arcseconds", kind: "number" },
    {
      id: "seeingFwhmArcseconds",
      label: "Seeing fwhm arcseconds",
      kind: "number",
    },
    { id: "lossCoefficient", label: "Loss coefficient", kind: "number" },
  ],
  outputs: [
    { id: "magnitudeLoss", label: "Magnitude loss", kind: "number" },
    {
      id: "relativeSignalToNoise",
      label: "Relative signal to noise",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      trailArcseconds: value.trailArcseconds as number,
      seeingFwhmArcseconds: value.seeingFwhmArcseconds as number,
      lossCoefficient: value.lossCoefficient as number,
    }),
});
export const run = tool.execute;
export default tool;
