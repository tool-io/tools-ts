import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedPorkProcessThicknessCoordinates: readonly number[];
  readonly callerMatchedPorkProcessThicknessResponses: readonly number[];
  readonly queryPorkProcessThicknessCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedPorkProcessThicknessCoordinates",
    label: "Observed pork process thickness coordinates",
    kind: "numberList",
  },
  {
    id: "callerMatchedPorkProcessThicknessResponses",
    label: "Caller matched pork process thickness responses",
    kind: "numberList",
  },
  {
    id: "queryPorkProcessThicknessCoordinate",
    label: "Query pork process thickness coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedPorkProcessThicknessCoordinates,
    input.callerMatchedPorkProcessThicknessResponses,
    "observedPorkProcessThicknessCoordinates",
  );
  const v = curve(
    input.observedPorkProcessThicknessCoordinates,
    input.callerMatchedPorkProcessThicknessResponses,
    input.queryPorkProcessThicknessCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPorkProcessThicknessCoordinates: [10, 20, 30],
  callerMatchedPorkProcessThicknessResponses: [20, 10, 5],
  queryPorkProcessThicknessCoordinate: 25,
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
  id: "cooking/pork-roast-time",
  title: "Cooking Pork Roast Time Calculator",
  description:
    "Same pork geometry/start/process actual endpoint time vs thickness. Conditional independently matched piecewise-linear calibration, no extrapolation. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedPorkProcessThicknessCoordinates:
        value.observedPorkProcessThicknessCoordinates as readonly number[],
      callerMatchedPorkProcessThicknessResponses:
        value.callerMatchedPorkProcessThicknessResponses as readonly number[],
      queryPorkProcessThicknessCoordinate:
        value.queryPorkProcessThicknessCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
