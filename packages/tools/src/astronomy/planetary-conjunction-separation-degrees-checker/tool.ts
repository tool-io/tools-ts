import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  sum,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualSameFrameUnitVectorA: readonly number[];
  readonly actualSameFrameUnitVectorB: readonly number[];
  readonly callerIndependentConjunctionReviewLimitDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSameFrameUnitVectorA",
    label: "Actual same frame unit vector a",
    kind: "numberList",
  },
  {
    id: "actualSameFrameUnitVectorB",
    label: "Actual same frame unit vector b",
    kind: "numberList",
  },
  {
    id: "callerIndependentConjunctionReviewLimitDegrees",
    label: "Caller independent conjunction review limit degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const a = input.actualSameFrameUnitVectorA,
    b = input.actualSameFrameUnitVectorB;
  if (
    a.length !== 3 ||
    b.length !== 3 ||
    Math.abs(Math.hypot(...a) - 1) > 1e-8 ||
    Math.abs(Math.hypot(...b) - 1) > 1e-8
  )
    simpleError("vectors", "Actualsameepoch/frameunit3vectors.");
  nonnegative(input.callerIndependentConjunctionReviewLimitDegrees, "limit");
  if (input.callerIndependentConjunctionReviewLimitDegrees > 180)
    simpleError("limit", "≤180°.");
  const cross = [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ],
    angle =
      (Math.atan2(Math.hypot(...cross), sum(a.map((v, i) => v * b[i]))) * 180) /
      Math.PI;
  return {
    greatCircleSeparationDegrees: angle,
    withinCallerConjunctionReviewLimit:
      angle <= input.callerIndependentConjunctionReviewLimitDegrees,
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualSameFrameUnitVectorA: [1, 0, 0],
    actualSameFrameUnitVectorB: [0, 1, 0],
    callerIndependentConjunctionReviewLimitDegrees: 5,
  },
  output: {
    result: {
      greatCircleSeparationDegrees: 90,
      withinCallerConjunctionReviewLimit: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/planetary-conjunction-separation-degrees-checker",
  title: "Planetary Conjunction Separation Degrees Checker",
  description:
    "Actualalreadyindependentmatchedplanetdirectionvector greatcircleseparation/callerlimit,not conjunctiondateephemeris prediction. Actual independent model/unit/frame/epoch/calibration and applicable measurement established;not precise ephemeris,forecast,geodesy operation,identity or safety approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
