import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedHardnessTensileCoordinates: readonly number[];
  readonly callerVerifiedHardnessTensileResponses: readonly number[];
  readonly queryHardnessTensileCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedMatchedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedHardnessTensileCoordinates",
    label: "Observed hardness tensile coordinates",
    kind: "numberList",
  },
  {
    id: "callerVerifiedHardnessTensileResponses",
    label: "Caller verified hardness tensile responses",
    kind: "numberList",
  },
  {
    id: "queryHardnessTensileCoordinate",
    label: "Query hardness tensile coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedHardnessTensileCoordinates,
    input.callerVerifiedHardnessTensileResponses,
    "observedHardnessTensileCoordinates",
  );
  const v = curve(
    input.observedHardnessTensileCoordinates,
    input.callerVerifiedHardnessTensileResponses,
    input.queryHardnessTensileCoordinate,
  );
  return { interpolatedMatchedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedHardnessTensileCoordinates: [1, 2, 3],
  callerVerifiedHardnessTensileResponses: [2, 4, 8],
  queryHardnessTensileCoordinate: 2.5,
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
  id: "engineering/tensile-strength-hardness-approx",
  title: "Tensile Strength from Hardness Approx Calculator",
  description:
    "Read independently matched hardness/tensile strength calibration. Independently matched piecewise-linear calibration, no extrapolation. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
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
      observedHardnessTensileCoordinates:
        value.observedHardnessTensileCoordinates as readonly number[],
      callerVerifiedHardnessTensileResponses:
        value.callerVerifiedHardnessTensileResponses as readonly number[],
      queryHardnessTensileCoordinate:
        value.queryHardnessTensileCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
