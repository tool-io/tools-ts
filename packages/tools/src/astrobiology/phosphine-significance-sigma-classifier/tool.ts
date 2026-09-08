import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyFittedFeatureAmplitude: number;
  readonly independentlyEstablishedOneSigmaError: number;
  readonly callerRequiredAbsoluteSigma: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyFittedFeatureAmplitude",
    label: "Independently fitted feature amplitude",
    kind: "number",
  },
  {
    id: "independentlyEstablishedOneSigmaError",
    label: "Independently established one sigma error",
    kind: "number",
  },
  {
    id: "callerRequiredAbsoluteSigma",
    label: "Caller required absolute sigma",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.independentlyEstablishedOneSigmaError, "sigmaerror");
  positive(input.callerRequiredAbsoluteSigma, "threshold");
  const s =
    input.independentlyFittedFeatureAmplitude /
    input.independentlyEstablishedOneSigmaError;
  return {
    conditionalSignedSigma: s,
    meetsCallerAbsoluteThreshold:
      Math.abs(s) >= input.callerRequiredAbsoluteSigma,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyFittedFeatureAmplitude: 3,
    independentlyEstablishedOneSigmaError: 1,
    callerRequiredAbsoluteSigma: 5,
  },
  output: {
    result: { conditionalSignedSigma: 3, meetsCallerAbsoluteThreshold: false },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/phosphine-significance-sigma-classifier",
  title: "Phosphine Detection Significance Sigma Level Classifier",
  description:
    "Actual fitted phosphine-feature signed signal/error relative to caller statistical threshold. Does not address look-elsewhere effects, non-Gaussian/systematic noise, line identity, abundance or life; no universal detection class.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
