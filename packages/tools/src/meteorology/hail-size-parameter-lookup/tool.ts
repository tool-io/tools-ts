import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedObservedHailDiagnosticCoordinates: readonly number[];
  readonly callerMatchedObservedHailDiagnosticResponses: readonly number[];
  readonly queryObservedHailDiagnosticCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedObservedHailDiagnosticCoordinates",
    label: "Observed observed hail diagnostic coordinates",
    kind: "numberList",
  },
  {
    id: "callerMatchedObservedHailDiagnosticResponses",
    label: "Caller matched observed hail diagnostic responses",
    kind: "numberList",
  },
  {
    id: "queryObservedHailDiagnosticCoordinate",
    label: "Query observed hail diagnostic coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedObservedHailDiagnosticCoordinates,
    input.callerMatchedObservedHailDiagnosticResponses,
    "observedObservedHailDiagnosticCoordinates",
  );
  const f = curve(
    input.observedObservedHailDiagnosticCoordinates,
    input.callerMatchedObservedHailDiagnosticResponses,
    input.queryObservedHailDiagnosticCoordinate,
  );
  return { interpolatedResponse: f.value, localObservedSlope: f.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedObservedHailDiagnosticCoordinates: [1, 2, 3],
  callerMatchedObservedHailDiagnosticResponses: [2, 4, 8],
  queryObservedHailDiagnosticCoordinate: 2.5,
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
  id: "meteorology/hail-size-parameter-lookup",
  title: "Hail Size Parameter Lookup",
  description:
    "Hail parameter/size conditional same-region independently verified observed calibration, not CAPE-only deterministic hail size prediction. Conditional independently matched piecewise-linear calibration, no extrapolation. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      observedObservedHailDiagnosticCoordinates:
        value.observedObservedHailDiagnosticCoordinates as readonly number[],
      callerMatchedObservedHailDiagnosticResponses:
        value.callerMatchedObservedHailDiagnosticResponses as readonly number[],
      queryObservedHailDiagnosticCoordinate:
        value.queryObservedHailDiagnosticCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
