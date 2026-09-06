import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, curve } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly observedHingeTraceSeverityCoordinates: readonly number[];
  readonly independentlyMatchedHingeTraceSeverityResponses: readonly number[];
  readonly queryHingeTraceSeverityCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedHingeTraceSeverityCoordinates",
    label: "Observed hinge trace severity coordinates",
    kind: "numberList",
  },
  {
    id: "independentlyMatchedHingeTraceSeverityResponses",
    label: "Independently matched hinge trace severity responses",
    kind: "numberList",
  },
  {
    id: "queryHingeTraceSeverityCoordinate",
    label: "Query hinge trace severity coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const v = curve(
    input.observedHingeTraceSeverityCoordinates,
    input.independentlyMatchedHingeTraceSeverityResponses,
    input.queryHingeTraceSeverityCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedHingeTraceSeverityCoordinates: [1, 2, 3],
  independentlyMatchedHingeTraceSeverityResponses: [2, 4, 8],
  queryHingeTraceSeverityCoordinate: 2.5,
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
  id: "philately/hinge-trace-penalty-rater",
  title: "Hinge Remover Trace Penalty Rater",
  description:
    "Map observed hinge-removal trace severity to caller penalty calibration. Matched piecewise-linear calibration, no extrapolation or universal thresholds. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      observedHingeTraceSeverityCoordinates:
        value.observedHingeTraceSeverityCoordinates as readonly number[],
      independentlyMatchedHingeTraceSeverityResponses:
        value.independentlyMatchedHingeTraceSeverityResponses as readonly number[],
      queryHingeTraceSeverityCoordinate:
        value.queryHingeTraceSeverityCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
