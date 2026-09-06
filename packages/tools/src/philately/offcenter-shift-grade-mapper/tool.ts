import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, curve } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly observedOffCenterShiftMmCoordinates: readonly number[];
  readonly independentlyMatchedOffCenterShiftMmResponses: readonly number[];
  readonly queryOffCenterShiftMmCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedOffCenterShiftMmCoordinates",
    label: "Observed off center shift mm coordinates",
    kind: "numberList",
  },
  {
    id: "independentlyMatchedOffCenterShiftMmResponses",
    label: "Independently matched off center shift mm responses",
    kind: "numberList",
  },
  {
    id: "queryOffCenterShiftMmCoordinate",
    label: "Query off center shift mm coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const v = curve(
    input.observedOffCenterShiftMmCoordinates,
    input.independentlyMatchedOffCenterShiftMmResponses,
    input.queryOffCenterShiftMmCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedOffCenterShiftMmCoordinates: [1, 2, 3],
  independentlyMatchedOffCenterShiftMmResponses: [2, 4, 8],
  queryOffCenterShiftMmCoordinate: 2.5,
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
  id: "philately/offcenter-shift-grade-mapper",
  title: "Off-Center Shift Millimetre Measurer to Grade Mapper",
  description:
    "Map measured off-center millimetre shift to caller grade calibration. Matched piecewise-linear calibration, no extrapolation or universal thresholds. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      observedOffCenterShiftMmCoordinates:
        value.observedOffCenterShiftMmCoordinates as readonly number[],
      independentlyMatchedOffCenterShiftMmResponses:
        value.independentlyMatchedOffCenterShiftMmResponses as readonly number[],
      queryOffCenterShiftMmCoordinate:
        value.queryOffCenterShiftMmCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
