import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, curve } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly observedFoldDepthCoordinates: readonly number[];
  readonly independentlyMatchedFoldDepthResponses: readonly number[];
  readonly queryFoldDepthCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedFoldDepthCoordinates",
    label: "Observed fold depth coordinates",
    kind: "numberList",
  },
  {
    id: "independentlyMatchedFoldDepthResponses",
    label: "Independently matched fold depth responses",
    kind: "numberList",
  },
  {
    id: "queryFoldDepthCoordinate",
    label: "Query fold depth coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const v = curve(
    input.observedFoldDepthCoordinates,
    input.independentlyMatchedFoldDepthResponses,
    input.queryFoldDepthCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFoldDepthCoordinates: [1, 2, 3],
  independentlyMatchedFoldDepthResponses: [2, 4, 8],
  queryFoldDepthCoordinate: 2.5,
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
  id: "philately/crease-fold-depth-rater",
  title: "Crease Detector Fold Depth Class Rater",
  description:
    "Rate independently measured crease depth, not inferred damage or automatic image detection. Matched piecewise-linear calibration, no extrapolation or universal thresholds. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      observedFoldDepthCoordinates:
        value.observedFoldDepthCoordinates as readonly number[],
      independentlyMatchedFoldDepthResponses:
        value.independentlyMatchedFoldDepthResponses as readonly number[],
      queryFoldDepthCoordinate: value.queryFoldDepthCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
