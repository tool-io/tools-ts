import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedBagelBoilTextureCoordinates: readonly number[];
  readonly callerMatchedBagelBoilTextureResponses: readonly number[];
  readonly queryBagelBoilTextureCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedBagelBoilTextureCoordinates",
    label: "Observed bagel boil texture coordinates",
    kind: "numberList",
  },
  {
    id: "callerMatchedBagelBoilTextureResponses",
    label: "Caller matched bagel boil texture responses",
    kind: "numberList",
  },
  {
    id: "queryBagelBoilTextureCoordinate",
    label: "Query bagel boil texture coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedBagelBoilTextureCoordinates,
    input.callerMatchedBagelBoilTextureResponses,
    "observedBagelBoilTextureCoordinates",
  );
  const v = curve(
    input.observedBagelBoilTextureCoordinates,
    input.callerMatchedBagelBoilTextureResponses,
    input.queryBagelBoilTextureCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBagelBoilTextureCoordinates: [10, 20, 30],
  callerMatchedBagelBoilTextureResponses: [20, 10, 5],
  queryBagelBoilTextureCoordinate: 25,
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
  id: "cooking/bagel-boil-time",
  title: "Cooking Bagel Boil Time Calculator",
  description:
    "Observed bagel surface-texture endpoint calibration under matched size/water formulation. Conditional independently matched piecewise-linear calibration, no extrapolation. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedBagelBoilTextureCoordinates:
        value.observedBagelBoilTextureCoordinates as readonly number[],
      callerMatchedBagelBoilTextureResponses:
        value.callerMatchedBagelBoilTextureResponses as readonly number[],
      queryBagelBoilTextureCoordinate:
        value.queryBagelBoilTextureCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
