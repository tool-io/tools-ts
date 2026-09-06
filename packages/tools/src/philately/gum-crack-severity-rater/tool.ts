import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, curve } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly observedGumCrackFrequencyCoordinates: readonly number[];
  readonly independentlyMatchedGumCrackFrequencyResponses: readonly number[];
  readonly queryGumCrackFrequencyCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedGumCrackFrequencyCoordinates",
    label: "Observed gum crack frequency coordinates",
    kind: "numberList",
  },
  {
    id: "independentlyMatchedGumCrackFrequencyResponses",
    label: "Independently matched gum crack frequency responses",
    kind: "numberList",
  },
  {
    id: "queryGumCrackFrequencyCoordinate",
    label: "Query gum crack frequency coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const v = curve(
    input.observedGumCrackFrequencyCoordinates,
    input.independentlyMatchedGumCrackFrequencyResponses,
    input.queryGumCrackFrequencyCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedGumCrackFrequencyCoordinates: [1, 2, 3],
  independentlyMatchedGumCrackFrequencyResponses: [2, 4, 8],
  queryGumCrackFrequencyCoordinate: 2.5,
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
  id: "philately/gum-crack-severity-rater",
  title: "Gum Crack Frequency Severity Rater",
  description:
    "Map observed gum-crack frequency to caller severity rubric. Matched piecewise-linear calibration, no extrapolation or universal thresholds. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      observedGumCrackFrequencyCoordinates:
        value.observedGumCrackFrequencyCoordinates as readonly number[],
      independentlyMatchedGumCrackFrequencyResponses:
        value.independentlyMatchedGumCrackFrequencyResponses as readonly number[],
      queryGumCrackFrequencyCoordinate:
        value.queryGumCrackFrequencyCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
