import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, curve } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedLimitingMagnitudeStarCountCoordinates: readonly number[];
  readonly independentlyMatchedLimitingMagnitudeStarCountResponses: readonly number[];
  readonly queryLimitingMagnitudeStarCountCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedLimitingMagnitudeStarCountCoordinates",
    label: "Observed limiting magnitude star count coordinates",
    kind: "numberList",
  },
  {
    id: "independentlyMatchedLimitingMagnitudeStarCountResponses",
    label: "Independently matched limiting magnitude star count responses",
    kind: "numberList",
  },
  {
    id: "queryLimitingMagnitudeStarCountCoordinate",
    label: "Query limiting magnitude star count coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const v = curve(
    input.observedLimitingMagnitudeStarCountCoordinates,
    input.independentlyMatchedLimitingMagnitudeStarCountResponses,
    input.queryLimitingMagnitudeStarCountCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLimitingMagnitudeStarCountCoordinates: [1, 2, 3],
  independentlyMatchedLimitingMagnitudeStarCountResponses: [2, 4, 8],
  queryLimitingMagnitudeStarCountCoordinate: 2.5,
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
  id: "astronomy/naked-eye-limiting-magnitude-count-stars-band",
  title: "Star Count Limiting Magnitude Band",
  description:
    "Independently same-sky-coverage catalog cumulative star count vs limiting magnitude, not universal naked-eye count. Matched piecewise-linear observational calibration with no extrapolation. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
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
      observedLimitingMagnitudeStarCountCoordinates:
        value.observedLimitingMagnitudeStarCountCoordinates as readonly number[],
      independentlyMatchedLimitingMagnitudeStarCountResponses:
        value.independentlyMatchedLimitingMagnitudeStarCountResponses as readonly number[],
      queryLimitingMagnitudeStarCountCoordinate:
        value.queryLimitingMagnitudeStarCountCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
