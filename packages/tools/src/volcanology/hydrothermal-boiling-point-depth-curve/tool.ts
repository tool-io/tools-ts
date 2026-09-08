import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedHydrothermalPressureCoordinates: readonly number[];
  readonly callerVerifiedHydrothermalPressureResponses: readonly number[];
  readonly queryHydrothermalPressureCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedMatchedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedHydrothermalPressureCoordinates",
    label: "Observed hydrothermal pressure coordinates",
    kind: "numberList",
  },
  {
    id: "callerVerifiedHydrothermalPressureResponses",
    label: "Caller verified hydrothermal pressure responses",
    kind: "numberList",
  },
  {
    id: "queryHydrothermalPressureCoordinate",
    label: "Query hydrothermal pressure coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedHydrothermalPressureCoordinates,
    input.callerVerifiedHydrothermalPressureResponses,
    "observedHydrothermalPressureCoordinates",
  );
  const v = curve(
    input.observedHydrothermalPressureCoordinates,
    input.callerVerifiedHydrothermalPressureResponses,
    input.queryHydrothermalPressureCoordinate,
  );
  return { interpolatedMatchedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedHydrothermalPressureCoordinates: [1, 2, 3],
  callerVerifiedHydrothermalPressureResponses: [100, 120, 140],
  queryHydrothermalPressureCoordinate: 2.5,
} satisfies Input;
export const exampleOutput = {
  interpolatedMatchedResponse: 130,
  localObservedSlope: 20.0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/hydrothermal-boiling-point-depth-curve",
  title: "Hydrothermal Boiling Point Depth Curve Calculator",
  description:
    "Read independently specified saturation pressure/boiling temperature curve, caller fluid composition and pressure/datum already independently resolved, no hydrostatic boiling-depth forecast. Independently matched piecewise-linear calibration, no extrapolation. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
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
      observedHydrothermalPressureCoordinates:
        value.observedHydrothermalPressureCoordinates as readonly number[],
      callerVerifiedHydrothermalPressureResponses:
        value.callerVerifiedHydrothermalPressureResponses as readonly number[],
      queryHydrothermalPressureCoordinate:
        value.queryHydrothermalPressureCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
