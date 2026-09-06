import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  linearFit,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedDrawdownTimesSeconds: readonly number[];
  readonly observedDrawdownPressurePa: readonly number[];
  readonly callerRadialAnalysisLogSlopeReferencePa: number;
}>;
export type Output = Readonly<{
  readonly fittedDrawdownNaturalLogSlopePa: number;
  readonly fittedDrawdownInterceptPa: number;
  readonly signedSlopeMinusReferencePa: number;
}>;
const inputFields = [
  {
    id: "observedDrawdownTimesSeconds",
    label: "Observed drawdown times seconds",
    kind: "numberList",
  },
  {
    id: "observedDrawdownPressurePa",
    label: "Observed drawdown pressure pa",
    kind: "numberList",
  },
  {
    id: "callerRadialAnalysisLogSlopeReferencePa",
    label: "Caller radial analysis log slope reference pa",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedDrawdownTimesSeconds.forEach((v) =>
    positive(v, "observedDrawdownTimesSeconds"),
  );
  input.observedDrawdownPressurePa.forEach((v) =>
    nonnegative(v, "observedDrawdownPressurePa"),
  );
  nonnegative(
    input.callerRadialAnalysisLogSlopeReferencePa,
    "callerRadialAnalysisLogSlopeReferencePa",
  );
  const f = linearFit(
    input.observedDrawdownTimesSeconds.map(Math.log),
    input.observedDrawdownPressurePa,
  );
  return {
    fittedDrawdownNaturalLogSlopePa: f.slope,
    fittedDrawdownInterceptPa: f.intercept,
    signedSlopeMinusReferencePa:
      f.slope - input.callerRadialAnalysisLogSlopeReferencePa,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDrawdownTimesSeconds: [1, 2.718281828459045, 7.3890560989306495],
  observedDrawdownPressurePa: [1, 3, 5],
  callerRadialAnalysisLogSlopeReferencePa: 2,
} satisfies Input;
export const exampleOutput = {
  fittedDrawdownNaturalLogSlopePa: 2,
  fittedDrawdownInterceptPa: 1,
  signedSlopeMinusReferencePa: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/drawdown-pressure-analysis",
  title: "Petroleum Drawdown Pressure Analysis Calculator",
  description:
    "Audit actual pressure drawdown versus natural-log elapsed time against independently established slope reference, not permeability inversion or model-selected regime; signed fit evidence retained. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedDrawdownNaturalLogSlopePa",
      label: "Fitted drawdown natural log slope pa",
      kind: "number",
    },
    {
      id: "fittedDrawdownInterceptPa",
      label: "Fitted drawdown intercept pa",
      kind: "number",
    },
    {
      id: "signedSlopeMinusReferencePa",
      label: "Signed slope minus reference pa",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDrawdownTimesSeconds:
        value.observedDrawdownTimesSeconds as readonly number[],
      observedDrawdownPressurePa:
        value.observedDrawdownPressurePa as readonly number[],
      callerRadialAnalysisLogSlopeReferencePa:
        value.callerRadialAnalysisLogSlopeReferencePa as number,
    }),
});
export const run = tool.execute;
export default tool;
