import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedTeaSteepingTemperatureCoordinates: readonly number[];
  readonly callerMatchedTeaSteepingTemperatureResponses: readonly number[];
  readonly queryTeaSteepingTemperatureCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedTeaSteepingTemperatureCoordinates",
    label: "Observed tea steeping temperature coordinates",
    kind: "numberList",
  },
  {
    id: "callerMatchedTeaSteepingTemperatureResponses",
    label: "Caller matched tea steeping temperature responses",
    kind: "numberList",
  },
  {
    id: "queryTeaSteepingTemperatureCoordinate",
    label: "Query tea steeping temperature coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedTeaSteepingTemperatureCoordinates,
    input.callerMatchedTeaSteepingTemperatureResponses,
    "observedTeaSteepingTemperatureCoordinates",
  );
  const v = curve(
    input.observedTeaSteepingTemperatureCoordinates,
    input.callerMatchedTeaSteepingTemperatureResponses,
    input.queryTeaSteepingTemperatureCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTeaSteepingTemperatureCoordinates: [10, 20, 30],
  callerMatchedTeaSteepingTemperatureResponses: [20, 10, 5],
  queryTeaSteepingTemperatureCoordinate: 25,
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
  id: "cooking/tea-steep-time-temperature",
  title: "Cooking Tea Steep Time Temperature Calculator",
  description:
    "Same tea/load observed extraction-endpoint steeping time vs temperature. Conditional independently matched piecewise-linear calibration, no extrapolation. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedTeaSteepingTemperatureCoordinates:
        value.observedTeaSteepingTemperatureCoordinates as readonly number[],
      callerMatchedTeaSteepingTemperatureResponses:
        value.callerMatchedTeaSteepingTemperatureResponses as readonly number[],
      queryTeaSteepingTemperatureCoordinate:
        value.queryTeaSteepingTemperatureCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
