import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedBrineThicknessCoordinates: readonly number[];
  readonly callerMatchedBrineThicknessResponses: readonly number[];
  readonly queryBrineThicknessCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedBrineThicknessCoordinates",
    label: "Observed brine thickness coordinates",
    kind: "numberList",
  },
  {
    id: "callerMatchedBrineThicknessResponses",
    label: "Caller matched brine thickness responses",
    kind: "numberList",
  },
  {
    id: "queryBrineThicknessCoordinate",
    label: "Query brine thickness coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedBrineThicknessCoordinates,
    input.callerMatchedBrineThicknessResponses,
    "observedBrineThicknessCoordinates",
  );
  const v = curve(
    input.observedBrineThicknessCoordinates,
    input.callerMatchedBrineThicknessResponses,
    input.queryBrineThicknessCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBrineThicknessCoordinates: [10, 20, 30],
  callerMatchedBrineThicknessResponses: [20, 10, 5],
  queryBrineThicknessCoordinate: 25,
} satisfies Input;
export const exampleOutput = {
  interpolatedResponse: 7.5,
  localObservedSlope: -0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/brine-time-per-weight",
  title: "Cooking Brine Time Per Weight Calculator",
  description:
    "Same-cut/salt/temperature observed brining duration vs measured thickness, not a mass-only universal brine recipe. Conditional independently matched piecewise-linear calibration, no extrapolation. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedBrineThicknessCoordinates:
        value.observedBrineThicknessCoordinates as readonly number[],
      callerMatchedBrineThicknessResponses:
        value.callerMatchedBrineThicknessResponses as readonly number[],
      queryBrineThicknessCoordinate:
        value.queryBrineThicknessCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
