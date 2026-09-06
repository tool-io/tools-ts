import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, curve } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly observedLongwaveResponseCoordinates: readonly number[];
  readonly independentlyMatchedLongwaveResponseResponses: readonly number[];
  readonly queryLongwaveResponseCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedLongwaveResponseCoordinates",
    label: "Observed longwave response coordinates",
    kind: "numberList",
  },
  {
    id: "independentlyMatchedLongwaveResponseResponses",
    label: "Independently matched longwave response responses",
    kind: "numberList",
  },
  {
    id: "queryLongwaveResponseCoordinate",
    label: "Query longwave response coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const v = curve(
    input.observedLongwaveResponseCoordinates,
    input.independentlyMatchedLongwaveResponseResponses,
    input.queryLongwaveResponseCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLongwaveResponseCoordinates: [1, 2, 3],
  independentlyMatchedLongwaveResponseResponses: [2, 4, 8],
  queryLongwaveResponseCoordinate: 2.5,
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
  id: "philately/uv-longwave-fluorescence-classifier",
  title: "Fluorescence Response UV Long-wave Classifier",
  description:
    "Map independently observed same-protocol long-wave UV response to caller calibration. Matched piecewise-linear calibration, no extrapolation or universal thresholds. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      observedLongwaveResponseCoordinates:
        value.observedLongwaveResponseCoordinates as readonly number[],
      independentlyMatchedLongwaveResponseResponses:
        value.independentlyMatchedLongwaveResponseResponses as readonly number[],
      queryLongwaveResponseCoordinate:
        value.queryLongwaveResponseCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
