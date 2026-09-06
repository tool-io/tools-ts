import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, curve } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly observedVarietyPremiumFactorCoordinates: readonly number[];
  readonly independentlyMatchedVarietyPremiumFactorResponses: readonly number[];
  readonly queryVarietyPremiumFactorCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedVarietyPremiumFactorCoordinates",
    label: "Observed variety premium factor coordinates",
    kind: "numberList",
  },
  {
    id: "independentlyMatchedVarietyPremiumFactorResponses",
    label: "Independently matched variety premium factor responses",
    kind: "numberList",
  },
  {
    id: "queryVarietyPremiumFactorCoordinate",
    label: "Query variety premium factor coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const v = curve(
    input.observedVarietyPremiumFactorCoordinates,
    input.independentlyMatchedVarietyPremiumFactorResponses,
    input.queryVarietyPremiumFactorCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedVarietyPremiumFactorCoordinates: [1, 2, 3],
  independentlyMatchedVarietyPremiumFactorResponses: [2, 4, 8],
  queryVarietyPremiumFactorCoordinate: 2.5,
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
  id: "philately/error-variety-multiplier-classifier",
  title: "Error Variety Multiplier Magnitude Classifier",
  description:
    "Classify independently observed matched error/non-error premium factor under caller calibration. Matched piecewise-linear calibration, no extrapolation or universal thresholds. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      observedVarietyPremiumFactorCoordinates:
        value.observedVarietyPremiumFactorCoordinates as readonly number[],
      independentlyMatchedVarietyPremiumFactorResponses:
        value.independentlyMatchedVarietyPremiumFactorResponses as readonly number[],
      queryVarietyPremiumFactorCoordinate:
        value.queryVarietyPremiumFactorCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
