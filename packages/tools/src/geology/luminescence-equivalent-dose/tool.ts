import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedLuminescenceGrowthSignalCoordinates: readonly number[];
  readonly callerMatchedLuminescenceGrowthSignalResponses: readonly number[];
  readonly queryLuminescenceGrowthSignalCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedLuminescenceGrowthSignalCoordinates",
    label: "Observed luminescence growth signal coordinates",
    kind: "numberList",
  },
  {
    id: "callerMatchedLuminescenceGrowthSignalResponses",
    label: "Caller matched luminescence growth signal responses",
    kind: "numberList",
  },
  {
    id: "queryLuminescenceGrowthSignalCoordinate",
    label: "Query luminescence growth signal coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedLuminescenceGrowthSignalCoordinates,
    input.callerMatchedLuminescenceGrowthSignalResponses,
    "observedLuminescenceGrowthSignalCoordinates",
  );
  const f = curve(
    input.observedLuminescenceGrowthSignalCoordinates,
    input.callerMatchedLuminescenceGrowthSignalResponses,
    input.queryLuminescenceGrowthSignalCoordinate,
  );
  return { interpolatedResponse: f.value, localObservedSlope: f.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLuminescenceGrowthSignalCoordinates: [1, 2, 3],
  callerMatchedLuminescenceGrowthSignalResponses: [2, 4, 8],
  queryLuminescenceGrowthSignalCoordinate: 2.5,
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
  id: "geology/luminescence-equivalent-dose",
  title: "Geology Luminescence Equivalent Dose Calculator",
  description:
    "Equivalent dose from independently fixed same-aliquot normalized luminescence growth curve; saturation, bleaching and dose-rate age conversion not inferred. Conditional independently matched piecewise-linear calibration, no extrapolation. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      observedLuminescenceGrowthSignalCoordinates:
        value.observedLuminescenceGrowthSignalCoordinates as readonly number[],
      callerMatchedLuminescenceGrowthSignalResponses:
        value.callerMatchedLuminescenceGrowthSignalResponses as readonly number[],
      queryLuminescenceGrowthSignalCoordinate:
        value.queryLuminescenceGrowthSignalCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
