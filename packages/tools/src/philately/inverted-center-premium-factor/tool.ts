import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, curve } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly observedInvertedCenterPremiumFactorCoordinates: readonly number[];
  readonly independentlyMatchedInvertedCenterPremiumFactorResponses: readonly number[];
  readonly queryInvertedCenterPremiumFactorCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedInvertedCenterPremiumFactorCoordinates",
    label: "Observed inverted center premium factor coordinates",
    kind: "numberList",
  },
  {
    id: "independentlyMatchedInvertedCenterPremiumFactorResponses",
    label: "Independently matched inverted center premium factor responses",
    kind: "numberList",
  },
  {
    id: "queryInvertedCenterPremiumFactorCoordinate",
    label: "Query inverted center premium factor coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const v = curve(
    input.observedInvertedCenterPremiumFactorCoordinates,
    input.independentlyMatchedInvertedCenterPremiumFactorResponses,
    input.queryInvertedCenterPremiumFactorCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedInvertedCenterPremiumFactorCoordinates: [1, 2, 3],
  independentlyMatchedInvertedCenterPremiumFactorResponses: [2, 4, 8],
  queryInvertedCenterPremiumFactorCoordinate: 2.5,
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
  id: "philately/inverted-center-premium-factor",
  title: "Inverted Center Premium Factor Lookup",
  description:
    "Interpolate independently matched inverted-center premium observations, not a universal rarity multiplier. Matched piecewise-linear calibration, no extrapolation or universal thresholds. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      observedInvertedCenterPremiumFactorCoordinates:
        value.observedInvertedCenterPremiumFactorCoordinates as readonly number[],
      independentlyMatchedInvertedCenterPremiumFactorResponses:
        value.independentlyMatchedInvertedCenterPremiumFactorResponses as readonly number[],
      queryInvertedCenterPremiumFactorCoordinate:
        value.queryInvertedCenterPremiumFactorCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
