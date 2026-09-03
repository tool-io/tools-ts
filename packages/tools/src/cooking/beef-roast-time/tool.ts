import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedBeefProcessThicknessCoordinates: readonly number[];
  readonly callerMatchedBeefProcessThicknessResponses: readonly number[];
  readonly queryBeefProcessThicknessCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedBeefProcessThicknessCoordinates",
    label: "Observed beef process thickness coordinates",
    kind: "numberList",
  },
  {
    id: "callerMatchedBeefProcessThicknessResponses",
    label: "Caller matched beef process thickness responses",
    kind: "numberList",
  },
  {
    id: "queryBeefProcessThicknessCoordinate",
    label: "Query beef process thickness coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedBeefProcessThicknessCoordinates,
    input.callerMatchedBeefProcessThicknessResponses,
    "observedBeefProcessThicknessCoordinates",
  );
  const v = curve(
    input.observedBeefProcessThicknessCoordinates,
    input.callerMatchedBeefProcessThicknessResponses,
    input.queryBeefProcessThicknessCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBeefProcessThicknessCoordinates: [10, 20, 30],
  callerMatchedBeefProcessThicknessResponses: [20, 10, 5],
  queryBeefProcessThicknessCoordinate: 25,
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
  id: "cooking/beef-roast-time",
  title: "Cooking Beef Roast Time Calculator",
  description:
    "Same beef geometry/start/process actual endpoint time vs thickness. Conditional independently matched piecewise-linear calibration, no extrapolation. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedBeefProcessThicknessCoordinates:
        value.observedBeefProcessThicknessCoordinates as readonly number[],
      callerMatchedBeefProcessThicknessResponses:
        value.callerMatchedBeefProcessThicknessResponses as readonly number[],
      queryBeefProcessThicknessCoordinate:
        value.queryBeefProcessThicknessCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
