import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, curve } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly observedShortTeethCountCoordinates: readonly number[];
  readonly independentlyMatchedShortTeethCountResponses: readonly number[];
  readonly queryShortTeethCountCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedShortTeethCountCoordinates",
    label: "Observed short teeth count coordinates",
    kind: "numberList",
  },
  {
    id: "independentlyMatchedShortTeethCountResponses",
    label: "Independently matched short teeth count responses",
    kind: "numberList",
  },
  {
    id: "queryShortTeethCountCoordinate",
    label: "Query short teeth count coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const v = curve(
    input.observedShortTeethCountCoordinates,
    input.independentlyMatchedShortTeethCountResponses,
    input.queryShortTeethCountCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedShortTeethCountCoordinates: [1, 2, 3],
  independentlyMatchedShortTeethCountResponses: [2, 4, 8],
  queryShortTeethCountCoordinate: 2.5,
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
  id: "philately/short-teeth-deduction-checker",
  title: "Short Perf Teeth Count Deduction Checker",
  description:
    "Rate counted short teeth under a matched caller deduction calibration. Matched piecewise-linear calibration, no extrapolation or universal thresholds. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      observedShortTeethCountCoordinates:
        value.observedShortTeethCountCoordinates as readonly number[],
      independentlyMatchedShortTeethCountResponses:
        value.independentlyMatchedShortTeethCountResponses as readonly number[],
      queryShortTeethCountCoordinate:
        value.queryShortTeethCountCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
