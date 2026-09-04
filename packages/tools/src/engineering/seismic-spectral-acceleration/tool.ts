import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedSeismicPeriodCoordinates: readonly number[];
  readonly callerVerifiedSeismicPeriodResponses: readonly number[];
  readonly querySeismicPeriodCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedMatchedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedSeismicPeriodCoordinates",
    label: "Observed seismic period coordinates",
    kind: "numberList",
  },
  {
    id: "callerVerifiedSeismicPeriodResponses",
    label: "Caller verified seismic period responses",
    kind: "numberList",
  },
  {
    id: "querySeismicPeriodCoordinate",
    label: "Query seismic period coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedSeismicPeriodCoordinates,
    input.callerVerifiedSeismicPeriodResponses,
    "observedSeismicPeriodCoordinates",
  );
  const v = curve(
    input.observedSeismicPeriodCoordinates,
    input.callerVerifiedSeismicPeriodResponses,
    input.querySeismicPeriodCoordinate,
  );
  return { interpolatedMatchedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSeismicPeriodCoordinates: [1, 2, 3],
  callerVerifiedSeismicPeriodResponses: [2, 4, 8],
  querySeismicPeriodCoordinate: 2.5,
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
  id: "engineering/seismic-spectral-acceleration",
  title: "Seismic Spectral Acceleration Calculator",
  description:
    "Read independently verified damping/site/edition-matched seismic acceleration spectrum over sampled periods. Independently matched piecewise-linear calibration, no extrapolation. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
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
      observedSeismicPeriodCoordinates:
        value.observedSeismicPeriodCoordinates as readonly number[],
      callerVerifiedSeismicPeriodResponses:
        value.callerVerifiedSeismicPeriodResponses as readonly number[],
      querySeismicPeriodCoordinate:
        value.querySeismicPeriodCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
