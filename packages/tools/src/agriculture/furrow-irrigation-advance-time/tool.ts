import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedFurrowFrontDistanceCoordinates: readonly number[];
  readonly callerVerifiedFurrowFrontDistanceResponses: readonly number[];
  readonly queryFurrowFrontDistanceCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedMatchedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedFurrowFrontDistanceCoordinates",
    label: "Observed furrow front distance coordinates",
    kind: "numberList",
  },
  {
    id: "callerVerifiedFurrowFrontDistanceResponses",
    label: "Caller verified furrow front distance responses",
    kind: "numberList",
  },
  {
    id: "queryFurrowFrontDistanceCoordinate",
    label: "Query furrow front distance coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedFurrowFrontDistanceCoordinates,
    input.callerVerifiedFurrowFrontDistanceResponses,
    "observedFurrowFrontDistanceCoordinates",
  );
  const v = curve(
    input.observedFurrowFrontDistanceCoordinates,
    input.callerVerifiedFurrowFrontDistanceResponses,
    input.queryFurrowFrontDistanceCoordinate,
  );
  return { interpolatedMatchedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFurrowFrontDistanceCoordinates: [0, 10, 20],
  callerVerifiedFurrowFrontDistanceResponses: [0, 2, 6],
  queryFurrowFrontDistanceCoordinate: 15,
} satisfies Input;
export const exampleOutput = {
  interpolatedMatchedResponse: 4,
  localObservedSlope: 0.4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/furrow-irrigation-advance-time",
  title: "Agriculture Furrow Irrigation Advance Time Calculator",
  description:
    "Read actual independently measured furrow-front distance/elapsed time, no infiltration/slope constants. Independently matched piecewise-linear calibration, no extrapolation. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
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
      observedFurrowFrontDistanceCoordinates:
        value.observedFurrowFrontDistanceCoordinates as readonly number[],
      callerVerifiedFurrowFrontDistanceResponses:
        value.callerVerifiedFurrowFrontDistanceResponses as readonly number[],
      queryFurrowFrontDistanceCoordinate:
        value.queryFurrowFrontDistanceCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
