import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedFishProcessThicknessCoordinates: readonly number[];
  readonly callerMatchedFishProcessThicknessResponses: readonly number[];
  readonly queryFishProcessThicknessCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedFishProcessThicknessCoordinates",
    label: "Observed fish process thickness coordinates",
    kind: "numberList",
  },
  {
    id: "callerMatchedFishProcessThicknessResponses",
    label: "Caller matched fish process thickness responses",
    kind: "numberList",
  },
  {
    id: "queryFishProcessThicknessCoordinate",
    label: "Query fish process thickness coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedFishProcessThicknessCoordinates,
    input.callerMatchedFishProcessThicknessResponses,
    "observedFishProcessThicknessCoordinates",
  );
  const v = curve(
    input.observedFishProcessThicknessCoordinates,
    input.callerMatchedFishProcessThicknessResponses,
    input.queryFishProcessThicknessCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFishProcessThicknessCoordinates: [10, 20, 30],
  callerMatchedFishProcessThicknessResponses: [20, 10, 5],
  queryFishProcessThicknessCoordinate: 25,
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
  id: "cooking/fish-bake-time",
  title: "Cooking Fish Bake Time Calculator",
  description:
    "Same fish geometry/start/process actual endpoint time vs thickness. Conditional independently matched piecewise-linear calibration, no extrapolation. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedFishProcessThicknessCoordinates:
        value.observedFishProcessThicknessCoordinates as readonly number[],
      callerMatchedFishProcessThicknessResponses:
        value.callerMatchedFishProcessThicknessResponses as readonly number[],
      queryFishProcessThicknessCoordinate:
        value.queryFishProcessThicknessCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
