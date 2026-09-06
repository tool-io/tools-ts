import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, curve } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly observedPaperThicknessMicrometresCoordinates: readonly number[];
  readonly independentlyMatchedPaperThicknessMicrometresResponses: readonly number[];
  readonly queryPaperThicknessMicrometresCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedPaperThicknessMicrometresCoordinates",
    label: "Observed paper thickness micrometres coordinates",
    kind: "numberList",
  },
  {
    id: "independentlyMatchedPaperThicknessMicrometresResponses",
    label: "Independently matched paper thickness micrometres responses",
    kind: "numberList",
  },
  {
    id: "queryPaperThicknessMicrometresCoordinate",
    label: "Query paper thickness micrometres coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const v = curve(
    input.observedPaperThicknessMicrometresCoordinates,
    input.independentlyMatchedPaperThicknessMicrometresResponses,
    input.queryPaperThicknessMicrometresCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPaperThicknessMicrometresCoordinates: [1, 2, 3],
  independentlyMatchedPaperThicknessMicrometresResponses: [2, 4, 8],
  queryPaperThicknessMicrometresCoordinate: 2.5,
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
  id: "philately/paper-thickness-class-rater",
  title: "Paper Thickness micrometre Range Class Rater",
  description:
    "Map observed paper thickness under caller matched issue/reference calibration. Matched piecewise-linear calibration, no extrapolation or universal thresholds. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      observedPaperThicknessMicrometresCoordinates:
        value.observedPaperThicknessMicrometresCoordinates as readonly number[],
      independentlyMatchedPaperThicknessMicrometresResponses:
        value.independentlyMatchedPaperThicknessMicrometresResponses as readonly number[],
      queryPaperThicknessMicrometresCoordinate:
        value.queryPaperThicknessMicrometresCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
