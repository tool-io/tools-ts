import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredDelta33SPerMil: number;
  readonly independentlyMeasuredDelta34SPerMil: number;
  readonly callerVerifiedMassDependentExponent: number;
  readonly callerAbsoluteAnomalyThresholdPerMil: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredDelta33SPerMil",
    label: "Independently measured delta33 s per mil",
    kind: "number",
  },
  {
    id: "independentlyMeasuredDelta34SPerMil",
    label: "Independently measured delta34 s per mil",
    kind: "number",
  },
  {
    id: "callerVerifiedMassDependentExponent",
    label: "Caller verified mass dependent exponent",
    kind: "number",
  },
  {
    id: "callerAbsoluteAnomalyThresholdPerMil",
    label: "Caller absolute anomaly threshold per mil",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (input.independentlyMeasuredDelta34SPerMil <= -1000)
    simpleError("delta34", "Positive isotope ratio implied.");
  positive(input.callerVerifiedMassDependentExponent, "exponent");
  positive(input.callerAbsoluteAnomalyThresholdPerMil, "threshold");
  const d =
    input.independentlyMeasuredDelta33SPerMil -
    1000 *
      Math.expm1(
        input.callerVerifiedMassDependentExponent *
          Math.log1p(input.independentlyMeasuredDelta34SPerMil / 1000),
      );
  return {
    conditionalCapitalDelta33SPerMil: d,
    meetsCallerAbsoluteAnomaly:
      Math.abs(d) >= input.callerAbsoluteAnomalyThresholdPerMil,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredDelta33SPerMil: 1,
    independentlyMeasuredDelta34SPerMil: 1,
    callerVerifiedMassDependentExponent: 0.515,
    callerAbsoluteAnomalyThresholdPerMil: 0.2,
  },
  output: {
    result: {
      conditionalCapitalDelta33SPerMil: 0.48512482689994485,
      meetsCallerAbsoluteAnomaly: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/s33-mif-anomaly-detector",
  title: "Sulfur Isotope Mass-Independent Fractionation Anomaly Detector",
  description:
    "Nonlinear mass-independent sulfur anomaly \u039433S=\u03b433S\u22121000[(1+\u03b434S/1000)^\u03bb\u22121]with independently applicable exponent. Not a universal biological signature or automatic geological interpretation.",
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
