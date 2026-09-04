import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedBrinellVickersCoordinates: readonly number[];
  readonly callerVerifiedBrinellVickersResponses: readonly number[];
  readonly queryBrinellVickersCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedMatchedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedBrinellVickersCoordinates",
    label: "Observed brinell vickers coordinates",
    kind: "numberList",
  },
  {
    id: "callerVerifiedBrinellVickersResponses",
    label: "Caller verified brinell vickers responses",
    kind: "numberList",
  },
  {
    id: "queryBrinellVickersCoordinate",
    label: "Query brinell vickers coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedBrinellVickersCoordinates,
    input.callerVerifiedBrinellVickersResponses,
    "observedBrinellVickersCoordinates",
  );
  const v = curve(
    input.observedBrinellVickersCoordinates,
    input.callerVerifiedBrinellVickersResponses,
    input.queryBrinellVickersCoordinate,
  );
  return { interpolatedMatchedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBrinellVickersCoordinates: [1, 2, 3],
  callerVerifiedBrinellVickersResponses: [2, 4, 8],
  queryBrinellVickersCoordinate: 2.5,
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
  id: "engineering/hardness-brinell-vickers-approx",
  title: "Hardness Conversion Approx Calculator",
  description:
    "Read specimen/material-specific Brinell–Vickers calibration. Independently matched piecewise-linear calibration, no extrapolation. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
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
      observedBrinellVickersCoordinates:
        value.observedBrinellVickersCoordinates as readonly number[],
      callerVerifiedBrinellVickersResponses:
        value.callerVerifiedBrinellVickersResponses as readonly number[],
      queryBrinellVickersCoordinate:
        value.queryBrinellVickersCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
