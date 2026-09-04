import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedMatchedSittingHeightStatureCoordinates: readonly number[];
  readonly callerMatchedMatchedSittingHeightStatureResponses: readonly number[];
  readonly queryMatchedSittingHeightStatureCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedMatchedSittingHeightStatureCoordinates",
    label: "Observed matched sitting height stature coordinates",
    kind: "numberList",
  },
  {
    id: "callerMatchedMatchedSittingHeightStatureResponses",
    label: "Caller matched sitting height stature responses",
    kind: "numberList",
  },
  {
    id: "queryMatchedSittingHeightStatureCoordinate",
    label: "Query matched sitting height stature coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedMatchedSittingHeightStatureCoordinates,
    input.callerMatchedMatchedSittingHeightStatureResponses,
    "observedMatchedSittingHeightStatureCoordinates",
  );
  const f = curve(
    input.observedMatchedSittingHeightStatureCoordinates,
    input.callerMatchedMatchedSittingHeightStatureResponses,
    input.queryMatchedSittingHeightStatureCoordinate,
  );
  return { interpolatedResponse: f.value, localObservedSlope: f.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMatchedSittingHeightStatureCoordinates: [1, 2, 3],
  callerMatchedMatchedSittingHeightStatureResponses: [2, 4, 8],
  queryMatchedSittingHeightStatureCoordinate: 2.5,
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
  id: "ergonomics/stature-percentile-from-sitting",
  title: "Anthropometric Stature Percentile Estimator from Sitting Height",
  description:
    "Stature conditional interpolation from independently paired same-population sitting-height/stature measurements; not fixed body-proportion multiplier or unprovided percentile population. Conditional independently matched piecewise-linear calibration, no extrapolation. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      observedMatchedSittingHeightStatureCoordinates:
        value.observedMatchedSittingHeightStatureCoordinates as readonly number[],
      callerMatchedMatchedSittingHeightStatureResponses:
        value.callerMatchedMatchedSittingHeightStatureResponses as readonly number[],
      queryMatchedSittingHeightStatureCoordinate:
        value.queryMatchedSittingHeightStatureCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
