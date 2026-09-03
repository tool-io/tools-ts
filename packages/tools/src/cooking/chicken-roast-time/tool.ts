import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedChickenProcessThicknessCoordinates: readonly number[];
  readonly callerMatchedChickenProcessThicknessResponses: readonly number[];
  readonly queryChickenProcessThicknessCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedChickenProcessThicknessCoordinates",
    label: "Observed chicken process thickness coordinates",
    kind: "numberList",
  },
  {
    id: "callerMatchedChickenProcessThicknessResponses",
    label: "Caller matched chicken process thickness responses",
    kind: "numberList",
  },
  {
    id: "queryChickenProcessThicknessCoordinate",
    label: "Query chicken process thickness coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedChickenProcessThicknessCoordinates,
    input.callerMatchedChickenProcessThicknessResponses,
    "observedChickenProcessThicknessCoordinates",
  );
  const v = curve(
    input.observedChickenProcessThicknessCoordinates,
    input.callerMatchedChickenProcessThicknessResponses,
    input.queryChickenProcessThicknessCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedChickenProcessThicknessCoordinates: [10, 20, 30],
  callerMatchedChickenProcessThicknessResponses: [20, 10, 5],
  queryChickenProcessThicknessCoordinate: 25,
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
  id: "cooking/chicken-roast-time",
  title: "Cooking Chicken Roast Time Calculator",
  description:
    "Same chicken geometry/start/process actual endpoint time vs thickness. Conditional independently matched piecewise-linear calibration, no extrapolation. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedChickenProcessThicknessCoordinates:
        value.observedChickenProcessThicknessCoordinates as readonly number[],
      callerMatchedChickenProcessThicknessResponses:
        value.callerMatchedChickenProcessThicknessResponses as readonly number[],
      queryChickenProcessThicknessCoordinate:
        value.queryChickenProcessThicknessCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
