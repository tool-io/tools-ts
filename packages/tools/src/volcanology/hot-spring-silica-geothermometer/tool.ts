import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedSilicaGeothermometerCoordinates: readonly number[];
  readonly callerVerifiedSilicaGeothermometerResponses: readonly number[];
  readonly querySilicaGeothermometerCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedMatchedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedSilicaGeothermometerCoordinates",
    label: "Observed silica geothermometer coordinates",
    kind: "numberList",
  },
  {
    id: "callerVerifiedSilicaGeothermometerResponses",
    label: "Caller verified silica geothermometer responses",
    kind: "numberList",
  },
  {
    id: "querySilicaGeothermometerCoordinate",
    label: "Query silica geothermometer coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedSilicaGeothermometerCoordinates,
    input.callerVerifiedSilicaGeothermometerResponses,
    "observedSilicaGeothermometerCoordinates",
  );
  const v = curve(
    input.observedSilicaGeothermometerCoordinates,
    input.callerVerifiedSilicaGeothermometerResponses,
    input.querySilicaGeothermometerCoordinate,
  );
  return { interpolatedMatchedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSilicaGeothermometerCoordinates: [10, 20, 30],
  callerVerifiedSilicaGeothermometerResponses: [40, 80, 100],
  querySilicaGeothermometerCoordinate: 25,
} satisfies Input;
export const exampleOutput = {
  interpolatedMatchedResponse: 90,
  localObservedSlope: 2.0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/hot-spring-silica-geothermometer",
  title: "Hot Spring Silica Geothermometer Calculator",
  description:
    "Read independently specified silica solubility/geothermometer branch, quartz/chalcedony and steam-loss state established externally; no universal dissolved-silica temperature law. Independently matched piecewise-linear calibration, no extrapolation. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
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
      observedSilicaGeothermometerCoordinates:
        value.observedSilicaGeothermometerCoordinates as readonly number[],
      callerVerifiedSilicaGeothermometerResponses:
        value.callerVerifiedSilicaGeothermometerResponses as readonly number[],
      querySilicaGeothermometerCoordinate:
        value.querySilicaGeothermometerCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
