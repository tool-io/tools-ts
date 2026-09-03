import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedSteakRestCoolingCoordinates: readonly number[];
  readonly callerMatchedSteakRestCoolingResponses: readonly number[];
  readonly querySteakRestCoolingCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedSteakRestCoolingCoordinates",
    label: "Observed steak rest cooling coordinates",
    kind: "numberList",
  },
  {
    id: "callerMatchedSteakRestCoolingResponses",
    label: "Caller matched steak rest cooling responses",
    kind: "numberList",
  },
  {
    id: "querySteakRestCoolingCoordinate",
    label: "Query steak rest cooling coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedSteakRestCoolingCoordinates,
    input.callerMatchedSteakRestCoolingResponses,
    "observedSteakRestCoolingCoordinates",
  );
  const v = curve(
    input.observedSteakRestCoolingCoordinates,
    input.callerMatchedSteakRestCoolingResponses,
    input.querySteakRestCoolingCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSteakRestCoolingCoordinates: [10, 20, 30],
  callerMatchedSteakRestCoolingResponses: [20, 10, 5],
  querySteakRestCoolingCoordinate: 25,
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
  id: "cooking/steak-rest-time",
  title: "Cooking Steak Rest Time Calculator",
  description:
    "Same steak postprocess cooling/texture endpoint observed rest-time calibration; no universal resting ratio. Conditional independently matched piecewise-linear calibration, no extrapolation. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedSteakRestCoolingCoordinates:
        value.observedSteakRestCoolingCoordinates as readonly number[],
      callerMatchedSteakRestCoolingResponses:
        value.callerMatchedSteakRestCoolingResponses as readonly number[],
      querySteakRestCoolingCoordinate:
        value.querySteakRestCoolingCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
