import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedCharpyKicCoordinates: readonly number[];
  readonly callerVerifiedCharpyKicResponses: readonly number[];
  readonly queryCharpyKicCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedMatchedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedCharpyKicCoordinates",
    label: "Observed charpy kic coordinates",
    kind: "numberList",
  },
  {
    id: "callerVerifiedCharpyKicResponses",
    label: "Caller verified charpy kic responses",
    kind: "numberList",
  },
  {
    id: "queryCharpyKicCoordinate",
    label: "Query charpy kic coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedCharpyKicCoordinates,
    input.callerVerifiedCharpyKicResponses,
    "observedCharpyKicCoordinates",
  );
  const v = curve(
    input.observedCharpyKicCoordinates,
    input.callerVerifiedCharpyKicResponses,
    input.queryCharpyKicCoordinate,
  );
  return { interpolatedMatchedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCharpyKicCoordinates: [1, 2, 3],
  callerVerifiedCharpyKicResponses: [2, 4, 8],
  queryCharpyKicCoordinate: 2.5,
} satisfies Input;
export const exampleOutput = {
  interpolatedMatchedResponse: 6,
  localObservedSlope: 4.0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/charpy-kic-correlation",
  title: "Charpy to KIC Correlation Calculator",
  description:
    "Read independently matched temperature/material Charpy–KIC empirical calibration, not a universal energy/toughness conversion. Independently matched piecewise-linear calibration, no extrapolation. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedMatchedResponse",
      label: "Interpolated matched response",
      kind: "number",
    },
    { id: "localObservedSlope", label: "Local observed slope", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedCharpyKicCoordinates:
        value.observedCharpyKicCoordinates as readonly number[],
      callerVerifiedCharpyKicResponses:
        value.callerVerifiedCharpyKicResponses as readonly number[],
      queryCharpyKicCoordinate: value.queryCharpyKicCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
