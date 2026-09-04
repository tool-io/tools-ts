import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedRockwellCoordinates: readonly number[];
  readonly callerVerifiedRockwellResponses: readonly number[];
  readonly queryRockwellCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedMatchedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedRockwellCoordinates",
    label: "Observed rockwell coordinates",
    kind: "numberList",
  },
  {
    id: "callerVerifiedRockwellResponses",
    label: "Caller verified rockwell responses",
    kind: "numberList",
  },
  {
    id: "queryRockwellCoordinate",
    label: "Query rockwell coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedRockwellCoordinates,
    input.callerVerifiedRockwellResponses,
    "observedRockwellCoordinates",
  );
  const v = curve(
    input.observedRockwellCoordinates,
    input.callerVerifiedRockwellResponses,
    input.queryRockwellCoordinate,
  );
  return { interpolatedMatchedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRockwellCoordinates: [1, 2, 3],
  callerVerifiedRockwellResponses: [2, 4, 8],
  queryRockwellCoordinate: 2.5,
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
  id: "engineering/rockwell-conversion-approx",
  title: "Rockwell Conversion Approx Calculator",
  description:
    "Read independently matched Rockwell scale/material calibration. Independently matched piecewise-linear calibration, no extrapolation. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
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
      observedRockwellCoordinates:
        value.observedRockwellCoordinates as readonly number[],
      callerVerifiedRockwellResponses:
        value.callerVerifiedRockwellResponses as readonly number[],
      queryRockwellCoordinate: value.queryRockwellCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
