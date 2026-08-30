import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, count, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly residuals: readonly number[];
  readonly standardErrors: readonly number[];
  readonly fittedParameters: number;
  readonly maximumReducedChiSquare: number;
}>;
export type Output = Readonly<{
  readonly chiSquare: number;
  readonly degreesOfFreedom: number;
  readonly reducedChiSquare: number;
  readonly passesSuppliedCriterion: boolean;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.residuals, input.standardErrors, "residuals");
  input.standardErrors.forEach((v) => positive(v, "standardErrors"));
  count(input.fittedParameters, "fittedParameters");
  positive(input.maximumReducedChiSquare, "maximumReducedChiSquare");
  const degreesOfFreedom = input.residuals.length - input.fittedParameters;
  positive(degreesOfFreedom, "fittedParameters");
  const chiSquare = input.residuals.reduce(
      (s, v, i) => s + (v / input.standardErrors[i]) ** 2,
      0,
    ),
    reducedChiSquare = chiSquare / degreesOfFreedom;
  return {
    chiSquare,
    degreesOfFreedom,
    reducedChiSquare,
    passesSuppliedCriterion: reducedChiSquare <= input.maximumReducedChiSquare,
  };
};
export const exampleInput = {
  residuals: [1, 2],
  standardErrors: [1, 2],
  fittedParameters: 1,
  maximumReducedChiSquare: 2,
} satisfies Input;
export const exampleOutput = {
  chiSquare: 2,
  degreesOfFreedom: 1,
  reducedChiSquare: 2,
  passesSuppliedCriterion: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/astrometric-reduced-chi-square",
  title: "Astrometric Reduced Chi Square",
  description:
    "Evaluate weighted astrometric residual chi-square and a supplied reduced-chi-square criterion; independent correctly estimated errors are assumed.",
  inputs: [
    { id: "residuals", label: "Residuals", kind: "numberList" },
    { id: "standardErrors", label: "Standard errors", kind: "numberList" },
    { id: "fittedParameters", label: "Fitted parameters", kind: "integer" },
    {
      id: "maximumReducedChiSquare",
      label: "Maximum reduced chi square",
      kind: "number",
    },
  ],
  outputs: [
    { id: "chiSquare", label: "Chi square", kind: "number" },
    { id: "degreesOfFreedom", label: "Degrees of freedom", kind: "number" },
    { id: "reducedChiSquare", label: "Reduced chi square", kind: "number" },
    {
      id: "passesSuppliedCriterion",
      label: "Passes supplied criterion",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      residuals: value.residuals as readonly number[],
      standardErrors: value.standardErrors as readonly number[],
      fittedParameters: value.fittedParameters as number,
      maximumReducedChiSquare: value.maximumReducedChiSquare as number,
    }),
});
export const run = tool.execute;
export default tool;
