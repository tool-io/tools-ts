import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedLmtdCorrectionCoordinates: readonly number[];
  readonly callerVerifiedLmtdCorrectionResponses: readonly number[];
  readonly queryLmtdCorrectionCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedMatchedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedLmtdCorrectionCoordinates",
    label: "Observed lmtd correction coordinates",
    kind: "numberList",
  },
  {
    id: "callerVerifiedLmtdCorrectionResponses",
    label: "Caller verified lmtd correction responses",
    kind: "numberList",
  },
  {
    id: "queryLmtdCorrectionCoordinate",
    label: "Query lmtd correction coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedLmtdCorrectionCoordinates,
    input.callerVerifiedLmtdCorrectionResponses,
    "observedLmtdCorrectionCoordinates",
  );
  const v = curve(
    input.observedLmtdCorrectionCoordinates,
    input.callerVerifiedLmtdCorrectionResponses,
    input.queryLmtdCorrectionCoordinate,
  );
  return { interpolatedMatchedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLmtdCorrectionCoordinates: [1, 2, 3],
  callerVerifiedLmtdCorrectionResponses: [2, 4, 8],
  queryLmtdCorrectionCoordinate: 2.5,
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
  id: "engineering/lmtd-correction-factor",
  title: "LMTD Correction Factor Calculator",
  description:
    "Read independently verified exchanger P/R/geometry-matched LMTD correction calibration. Independently matched piecewise-linear calibration, no extrapolation. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
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
      observedLmtdCorrectionCoordinates:
        value.observedLmtdCorrectionCoordinates as readonly number[],
      callerVerifiedLmtdCorrectionResponses:
        value.callerVerifiedLmtdCorrectionResponses as readonly number[],
      queryLmtdCorrectionCoordinate:
        value.queryLmtdCorrectionCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
