import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly sourceKgSecond: number;
  readonly windMSecond: number;
  readonly sigmaYM: number;
  readonly sigmaZM: number;
  readonly crosswindOffsetM: number;
  readonly receptorHeightM: number;
  readonly sourceHeightM: number;
}>;
export type Output = Readonly<{ readonly reflectedGaussianPlumeKgM3: number }>;
const inputFields = [
  { id: "sourceKgSecond", label: "Source kg second", kind: "number" },
  { id: "windMSecond", label: "Wind m second", kind: "number" },
  { id: "sigmaYM", label: "Sigma y m", kind: "number" },
  { id: "sigmaZM", label: "Sigma z m", kind: "number" },
  { id: "crosswindOffsetM", label: "Crosswind offset m", kind: "number" },
  { id: "receptorHeightM", label: "Receptor height m", kind: "number" },
  { id: "sourceHeightM", label: "Source height m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.windMSecond, "windMSecond");
  positive(input.sigmaYM, "sigmaYM");
  positive(input.sigmaZM, "sigmaZM");
  nonnegative(input.sourceKgSecond, "sourceKgSecond");
  nonnegative(input.receptorHeightM, "receptorHeightM");
  nonnegative(input.sourceHeightM, "sourceHeightM");
  return {
    reflectedGaussianPlumeKgM3:
      (input.sourceKgSecond /
        (2 * Math.PI * input.windMSecond * input.sigmaYM * input.sigmaZM)) *
      Math.exp(-0.5 * (input.crosswindOffsetM / input.sigmaYM) ** 2) *
      (Math.exp(
        -0.5 *
          ((input.receptorHeightM - input.sourceHeightM) / input.sigmaZM) ** 2,
      ) +
        Math.exp(
          -0.5 *
            ((input.receptorHeightM + input.sourceHeightM) / input.sigmaZM) **
              2,
        )),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sourceKgSecond: 1,
  windMSecond: 2,
  sigmaYM: 3,
  sigmaZM: 4,
  crosswindOffsetM: 0,
  receptorHeightM: 0,
  sourceHeightM: 0,
} satisfies Input;
export const exampleOutput = {
  reflectedGaussianPlumeKgM3: 0.013262911924324612,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/gaussian-plume-concentration",
  title: "Gaussian Plume Concentration Calculator",
  description:
    "Steady Gaussian point plume with ideal reflecting ground, independently supplied dispersion at receptor, no downwind sigma defaults or exposure clearance. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "reflectedGaussianPlumeKgM3",
      label: "Reflected gaussian plume kg m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sourceKgSecond: value.sourceKgSecond as number,
      windMSecond: value.windMSecond as number,
      sigmaYM: value.sigmaYM as number,
      sigmaZM: value.sigmaZM as number,
      crosswindOffsetM: value.crosswindOffsetM as number,
      receptorHeightM: value.receptorHeightM as number,
      sourceHeightM: value.sourceHeightM as number,
    }),
});
export const run = tool.execute;
export default tool;
