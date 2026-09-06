import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  mean,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedAlignedTypeCurvePressures: readonly number[];
  readonly callerMatchedDimensionlessTypeCurveValues: readonly number[];
  readonly callerMaximumLogShapeRmse: number;
}>;
export type Output = Readonly<{
  readonly fittedTypeCurveVerticalPressureScale: number;
  readonly logShapeRmse: number;
  readonly withinCallerTypeCurveShapeTolerance: boolean;
}>;
const inputFields = [
  {
    id: "observedAlignedTypeCurvePressures",
    label: "Observed aligned type curve pressures",
    kind: "numberList",
  },
  {
    id: "callerMatchedDimensionlessTypeCurveValues",
    label: "Caller matched dimensionless type curve values",
    kind: "numberList",
  },
  {
    id: "callerMaximumLogShapeRmse",
    label: "Caller maximum log shape rmse",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedAlignedTypeCurvePressures.forEach((v) =>
    positive(v, "observedAlignedTypeCurvePressures"),
  );
  input.callerMatchedDimensionlessTypeCurveValues.forEach((v) =>
    positive(v, "callerMatchedDimensionlessTypeCurveValues"),
  );
  nonnegative(input.callerMaximumLogShapeRmse, "callerMaximumLogShapeRmse");
  aligned(
    input.observedAlignedTypeCurvePressures,
    input.callerMatchedDimensionlessTypeCurveValues,
    "observedAlignedTypeCurvePressures",
  );
  const ratios = input.observedAlignedTypeCurvePressures.map(
      (v, i) =>
        Math.log(v) -
        Math.log(input.callerMatchedDimensionlessTypeCurveValues[i]),
    ),
    m = mean(ratios),
    rmse = Math.sqrt(mean(ratios.map((v) => (v - m) ** 2)));
  return {
    fittedTypeCurveVerticalPressureScale: Math.exp(m),
    logShapeRmse: rmse,
    withinCallerTypeCurveShapeTolerance:
      rmse <= input.callerMaximumLogShapeRmse,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAlignedTypeCurvePressures: [2, 4, 8],
  callerMatchedDimensionlessTypeCurveValues: [1, 2, 4],
  callerMaximumLogShapeRmse: 0.1,
} satisfies Input;
export const exampleOutput = {
  fittedTypeCurveVerticalPressureScale: 2,
  logShapeRmse: 0,
  withinCallerTypeCurveShapeTolerance: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/type-curve-match",
  title: "Petroleum Type Curve Match Calculator",
  description:
    "Fit actual caller independently time-aligned type curve vertical log-scale and shape residual, no inferred time shift, reservoir regime identity or permeability from unspecified normalization. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedTypeCurveVerticalPressureScale",
      label: "Fitted type curve vertical pressure scale",
      kind: "number",
    },
    { id: "logShapeRmse", label: "Log shape rmse", kind: "number" },
    {
      id: "withinCallerTypeCurveShapeTolerance",
      label: "Within caller type curve shape tolerance",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAlignedTypeCurvePressures:
        value.observedAlignedTypeCurvePressures as readonly number[],
      callerMatchedDimensionlessTypeCurveValues:
        value.callerMatchedDimensionlessTypeCurveValues as readonly number[],
      callerMaximumLogShapeRmse: value.callerMaximumLogShapeRmse as number,
    }),
});
export const run = tool.execute;
export default tool;
