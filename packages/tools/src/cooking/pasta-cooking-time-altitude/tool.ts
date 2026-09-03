import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedPastaLocalBoilingTemperatureCoordinates: readonly number[];
  readonly callerMatchedPastaLocalBoilingTemperatureResponses: readonly number[];
  readonly queryPastaLocalBoilingTemperatureCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedPastaLocalBoilingTemperatureCoordinates",
    label: "Observed pasta local boiling temperature coordinates",
    kind: "numberList",
  },
  {
    id: "callerMatchedPastaLocalBoilingTemperatureResponses",
    label: "Caller matched pasta local boiling temperature responses",
    kind: "numberList",
  },
  {
    id: "queryPastaLocalBoilingTemperatureCoordinate",
    label: "Query pasta local boiling temperature coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedPastaLocalBoilingTemperatureCoordinates,
    input.callerMatchedPastaLocalBoilingTemperatureResponses,
    "observedPastaLocalBoilingTemperatureCoordinates",
  );
  const v = curve(
    input.observedPastaLocalBoilingTemperatureCoordinates,
    input.callerMatchedPastaLocalBoilingTemperatureResponses,
    input.queryPastaLocalBoilingTemperatureCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPastaLocalBoilingTemperatureCoordinates: [10, 20, 30],
  callerMatchedPastaLocalBoilingTemperatureResponses: [20, 10, 5],
  queryPastaLocalBoilingTemperatureCoordinate: 25,
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
  id: "cooking/pasta-cooking-time-altitude",
  title: "Cooking Pasta Cooking Time Altitude Calculator",
  description:
    "Same pasta/boiling-water actual time endpoint calibration, boiling point externally measured rather than inferred altitude. Conditional independently matched piecewise-linear calibration, no extrapolation. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedPastaLocalBoilingTemperatureCoordinates:
        value.observedPastaLocalBoilingTemperatureCoordinates as readonly number[],
      callerMatchedPastaLocalBoilingTemperatureResponses:
        value.callerMatchedPastaLocalBoilingTemperatureResponses as readonly number[],
      queryPastaLocalBoilingTemperatureCoordinate:
        value.queryPastaLocalBoilingTemperatureCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
