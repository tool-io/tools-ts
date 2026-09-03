import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedPoachedEggProcessTemperatureCoordinates: readonly number[];
  readonly callerMatchedPoachedEggProcessTemperatureResponses: readonly number[];
  readonly queryPoachedEggProcessTemperatureCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedPoachedEggProcessTemperatureCoordinates",
    label: "Observed poached egg process temperature coordinates",
    kind: "numberList",
  },
  {
    id: "callerMatchedPoachedEggProcessTemperatureResponses",
    label: "Caller matched poached egg process temperature responses",
    kind: "numberList",
  },
  {
    id: "queryPoachedEggProcessTemperatureCoordinate",
    label: "Query poached egg process temperature coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedPoachedEggProcessTemperatureCoordinates,
    input.callerMatchedPoachedEggProcessTemperatureResponses,
    "observedPoachedEggProcessTemperatureCoordinates",
  );
  const v = curve(
    input.observedPoachedEggProcessTemperatureCoordinates,
    input.callerMatchedPoachedEggProcessTemperatureResponses,
    input.queryPoachedEggProcessTemperatureCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPoachedEggProcessTemperatureCoordinates: [10, 20, 30],
  callerMatchedPoachedEggProcessTemperatureResponses: [20, 10, 5],
  queryPoachedEggProcessTemperatureCoordinate: 25,
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
  id: "cooking/egg-poach-time",
  title: "Cooking Egg Poach Time Calculator",
  description:
    "Same egg/start conditions actual poaching endpoint-time calibration. Conditional independently matched piecewise-linear calibration, no extrapolation. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedPoachedEggProcessTemperatureCoordinates:
        value.observedPoachedEggProcessTemperatureCoordinates as readonly number[],
      callerMatchedPoachedEggProcessTemperatureResponses:
        value.callerMatchedPoachedEggProcessTemperatureResponses as readonly number[],
      queryPoachedEggProcessTemperatureCoordinate:
        value.queryPoachedEggProcessTemperatureCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
