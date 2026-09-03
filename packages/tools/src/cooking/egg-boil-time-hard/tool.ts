import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedHardEggSizeCoordinates: readonly number[];
  readonly callerMatchedHardEggSizeResponses: readonly number[];
  readonly queryHardEggSizeCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedHardEggSizeCoordinates",
    label: "Observed hard egg size coordinates",
    kind: "numberList",
  },
  {
    id: "callerMatchedHardEggSizeResponses",
    label: "Caller matched hard egg size responses",
    kind: "numberList",
  },
  {
    id: "queryHardEggSizeCoordinate",
    label: "Query hard egg size coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedHardEggSizeCoordinates,
    input.callerMatchedHardEggSizeResponses,
    "observedHardEggSizeCoordinates",
  );
  const v = curve(
    input.observedHardEggSizeCoordinates,
    input.callerMatchedHardEggSizeResponses,
    input.queryHardEggSizeCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedHardEggSizeCoordinates: [10, 20, 30],
  callerMatchedHardEggSizeResponses: [20, 10, 5],
  queryHardEggSizeCoordinate: 25,
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
  id: "cooking/egg-boil-time-hard",
  title: "Cooking Egg Boil Time Hard Calculator",
  description:
    "Hard-texture egg endpoint time vs independently matched size/start-temperature/process observations. Conditional independently matched piecewise-linear calibration, no extrapolation. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedHardEggSizeCoordinates:
        value.observedHardEggSizeCoordinates as readonly number[],
      callerMatchedHardEggSizeResponses:
        value.callerMatchedHardEggSizeResponses as readonly number[],
      queryHardEggSizeCoordinate: value.queryHardEggSizeCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
