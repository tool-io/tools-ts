import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedSoftEggSizeCoordinates: readonly number[];
  readonly callerMatchedSoftEggSizeResponses: readonly number[];
  readonly querySoftEggSizeCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedSoftEggSizeCoordinates",
    label: "Observed soft egg size coordinates",
    kind: "numberList",
  },
  {
    id: "callerMatchedSoftEggSizeResponses",
    label: "Caller matched soft egg size responses",
    kind: "numberList",
  },
  {
    id: "querySoftEggSizeCoordinate",
    label: "Query soft egg size coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedSoftEggSizeCoordinates,
    input.callerMatchedSoftEggSizeResponses,
    "observedSoftEggSizeCoordinates",
  );
  const v = curve(
    input.observedSoftEggSizeCoordinates,
    input.callerMatchedSoftEggSizeResponses,
    input.querySoftEggSizeCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSoftEggSizeCoordinates: [10, 20, 30],
  callerMatchedSoftEggSizeResponses: [20, 10, 5],
  querySoftEggSizeCoordinate: 25,
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
  id: "cooking/egg-boil-time-soft",
  title: "Cooking Egg Boil Time Soft Calculator",
  description:
    "Soft-texture egg endpoint time vs independently matched size/start-temperature/process observations. Conditional independently matched piecewise-linear calibration, no extrapolation. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedSoftEggSizeCoordinates:
        value.observedSoftEggSizeCoordinates as readonly number[],
      callerMatchedSoftEggSizeResponses:
        value.callerMatchedSoftEggSizeResponses as readonly number[],
      querySoftEggSizeCoordinate: value.querySoftEggSizeCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
