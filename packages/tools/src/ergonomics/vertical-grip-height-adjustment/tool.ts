import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedMeasuredGripHeightCoordinates: readonly number[];
  readonly callerMatchedMeasuredGripHeightResponses: readonly number[];
  readonly queryMeasuredGripHeightCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedMeasuredGripHeightCoordinates",
    label: "Observed measured grip height coordinates",
    kind: "numberList",
  },
  {
    id: "callerMatchedMeasuredGripHeightResponses",
    label: "Caller matched measured grip height responses",
    kind: "numberList",
  },
  {
    id: "queryMeasuredGripHeightCoordinate",
    label: "Query measured grip height coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedMeasuredGripHeightCoordinates,
    input.callerMatchedMeasuredGripHeightResponses,
    "observedMeasuredGripHeightCoordinates",
  );
  const f = curve(
    input.observedMeasuredGripHeightCoordinates,
    input.callerMatchedMeasuredGripHeightResponses,
    input.queryMeasuredGripHeightCoordinate,
  );
  return { interpolatedResponse: f.value, localObservedSlope: f.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMeasuredGripHeightCoordinates: [1, 2, 3],
  callerMatchedMeasuredGripHeightResponses: [2, 4, 8],
  queryMeasuredGripHeightCoordinate: 2.5,
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
  id: "ergonomics/vertical-grip-height-adjustment",
  title: "Anthropometric Vertical Grip Strength Height Adjustment Calculator",
  description:
    "Grip-force height adjustment from independently same-person/protocol measured height-force calibration, no universal anthropometric correction. Conditional independently matched piecewise-linear calibration, no extrapolation. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      observedMeasuredGripHeightCoordinates:
        value.observedMeasuredGripHeightCoordinates as readonly number[],
      callerMatchedMeasuredGripHeightResponses:
        value.callerMatchedMeasuredGripHeightResponses as readonly number[],
      queryMeasuredGripHeightCoordinate:
        value.queryMeasuredGripHeightCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
