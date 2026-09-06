import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, curve } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly observedFontMismatchDistanceCoordinates: readonly number[];
  readonly independentlyMatchedFontMismatchDistanceResponses: readonly number[];
  readonly queryFontMismatchDistanceCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedFontMismatchDistanceCoordinates",
    label: "Observed font mismatch distance coordinates",
    kind: "numberList",
  },
  {
    id: "independentlyMatchedFontMismatchDistanceResponses",
    label: "Independently matched font mismatch distance responses",
    kind: "numberList",
  },
  {
    id: "queryFontMismatchDistanceCoordinate",
    label: "Query font mismatch distance coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const v = curve(
    input.observedFontMismatchDistanceCoordinates,
    input.independentlyMatchedFontMismatchDistanceResponses,
    input.queryFontMismatchDistanceCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFontMismatchDistanceCoordinates: [1, 2, 3],
  independentlyMatchedFontMismatchDistanceResponses: [2, 4, 8],
  queryFontMismatchDistanceCoordinate: 2.5,
} satisfies Input;
export const exampleOutput = {
  interpolatedResponse: 6,
  localObservedSlope: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/facsimile-font-risk-rater",
  title: "Facsimile Reproduction Font Mismatch Risk Rater",
  description:
    "Map independently measured facsimile font mismatch to caller risk rubric, not automatic OCR or authenticity. Matched piecewise-linear calibration, no extrapolation or universal thresholds. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedResponse",
      label: "Interpolated response",
      kind: "number",
    },
    { id: "localObservedSlope", label: "Local observed slope", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedFontMismatchDistanceCoordinates:
        value.observedFontMismatchDistanceCoordinates as readonly number[],
      independentlyMatchedFontMismatchDistanceResponses:
        value.independentlyMatchedFontMismatchDistanceResponses as readonly number[],
      queryFontMismatchDistanceCoordinate:
        value.queryFontMismatchDistanceCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
