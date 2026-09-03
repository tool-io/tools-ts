import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedRunwayPerformanceCoordinates: readonly number[];
  readonly callerVerifiedRunwayPerformanceResponses: readonly number[];
  readonly queryRunwayPerformanceCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedMatchedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedRunwayPerformanceCoordinates",
    label: "Observed runway performance coordinates",
    kind: "numberList",
  },
  {
    id: "callerVerifiedRunwayPerformanceResponses",
    label: "Caller verified runway performance responses",
    kind: "numberList",
  },
  {
    id: "queryRunwayPerformanceCoordinate",
    label: "Query runway performance coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedRunwayPerformanceCoordinates,
    input.callerVerifiedRunwayPerformanceResponses,
    "observedRunwayPerformanceCoordinates",
  );
  const v = curve(
    input.observedRunwayPerformanceCoordinates,
    input.callerVerifiedRunwayPerformanceResponses,
    input.queryRunwayPerformanceCoordinate,
  );
  return { interpolatedMatchedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRunwayPerformanceCoordinates: [1, 2, 3],
  callerVerifiedRunwayPerformanceResponses: [2, 4, 8],
  queryRunwayPerformanceCoordinate: 2.5,
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
  id: "engineering/airport-runway-length",
  title: "Airport Runway Length Calculator",
  description:
    "Read independently certified aircraft/configuration/environment-matched runway performance calibration; no generic airport altitude corrections or takeoff clearance. Independently matched piecewise-linear calibration, no extrapolation. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
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
      observedRunwayPerformanceCoordinates:
        value.observedRunwayPerformanceCoordinates as readonly number[],
      callerVerifiedRunwayPerformanceResponses:
        value.callerVerifiedRunwayPerformanceResponses as readonly number[],
      queryRunwayPerformanceCoordinate:
        value.queryRunwayPerformanceCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
