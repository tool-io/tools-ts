import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedTiltShapeRatioCoordinates: readonly number[];
  readonly callerVerifiedTiltShapeRatioResponses: readonly number[];
  readonly queryTiltShapeRatioCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedMatchedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedTiltShapeRatioCoordinates",
    label: "Observed tilt shape ratio coordinates",
    kind: "numberList",
  },
  {
    id: "callerVerifiedTiltShapeRatioResponses",
    label: "Caller verified tilt shape ratio responses",
    kind: "numberList",
  },
  {
    id: "queryTiltShapeRatioCoordinate",
    label: "Query tilt shape ratio coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedTiltShapeRatioCoordinates,
    input.callerVerifiedTiltShapeRatioResponses,
    "observedTiltShapeRatioCoordinates",
  );
  const v = curve(
    input.observedTiltShapeRatioCoordinates,
    input.callerVerifiedTiltShapeRatioResponses,
    input.queryTiltShapeRatioCoordinate,
  );
  return { interpolatedMatchedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTiltShapeRatioCoordinates: [1, 2, 3],
  callerVerifiedTiltShapeRatioResponses: [2, 4, 8],
  queryTiltShapeRatioCoordinate: 2.5,
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
  id: "volcanology/tilt-vector-magma-depth-estimate",
  title: "Tilt Vector Magma Depth Estimate Calculator",
  description:
    "Infer source-depth coordinate from independently supplied invertible model-specific tilt-shape ratio/depth calibration; full source geometry and nuisance parameters fixed externally, no fabricated Mogi inversion. Independently matched piecewise-linear calibration, no extrapolation. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
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
      observedTiltShapeRatioCoordinates:
        value.observedTiltShapeRatioCoordinates as readonly number[],
      callerVerifiedTiltShapeRatioResponses:
        value.callerVerifiedTiltShapeRatioResponses as readonly number[],
      queryTiltShapeRatioCoordinate:
        value.queryTiltShapeRatioCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
