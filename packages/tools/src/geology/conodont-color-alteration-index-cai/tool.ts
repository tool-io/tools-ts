import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedCaiThermalReferenceCoordinates: readonly number[];
  readonly callerMatchedCaiThermalReferenceResponses: readonly number[];
  readonly queryCaiThermalReferenceCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedCaiThermalReferenceCoordinates",
    label: "Observed cai thermal reference coordinates",
    kind: "numberList",
  },
  {
    id: "callerMatchedCaiThermalReferenceResponses",
    label: "Caller matched cai thermal reference responses",
    kind: "numberList",
  },
  {
    id: "queryCaiThermalReferenceCoordinate",
    label: "Query cai thermal reference coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedCaiThermalReferenceCoordinates,
    input.callerMatchedCaiThermalReferenceResponses,
    "observedCaiThermalReferenceCoordinates",
  );
  const f = curve(
    input.observedCaiThermalReferenceCoordinates,
    input.callerMatchedCaiThermalReferenceResponses,
    input.queryCaiThermalReferenceCoordinate,
  );
  return { interpolatedResponse: f.value, localObservedSlope: f.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCaiThermalReferenceCoordinates: [1, 2, 3],
  callerMatchedCaiThermalReferenceResponses: [2, 4, 8],
  queryCaiThermalReferenceCoordinate: 2.5,
} satisfies Input;
export const exampleOutput = {
  interpolatedResponse: 6,
  localObservedSlope: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/conodont-color-alteration-index-cai",
  title: "Geology Conodont Color Alteration Index Cai Calculator",
  description:
    "Conodont CAI from independently matched color-index/thermal-reference calibration, duration and assemblage held fixed; not uncalibrated color thermometer. Conditional independently matched piecewise-linear calibration, no extrapolation. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedResponse",
      label: "Interpolated response",
      kind: "number",
    },
    { id: "localObservedSlope", label: "Local observed slope", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedCaiThermalReferenceCoordinates:
        value.observedCaiThermalReferenceCoordinates as readonly number[],
      callerMatchedCaiThermalReferenceResponses:
        value.callerMatchedCaiThermalReferenceResponses as readonly number[],
      queryCaiThermalReferenceCoordinate:
        value.queryCaiThermalReferenceCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
