import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedFermentationTemperatureCoordinates: readonly number[];
  readonly callerMatchedFermentationTemperatureResponses: readonly number[];
  readonly queryFermentationTemperatureCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedFermentationTemperatureCoordinates",
    label: "Observed fermentation temperature coordinates",
    kind: "numberList",
  },
  {
    id: "callerMatchedFermentationTemperatureResponses",
    label: "Caller matched fermentation temperature responses",
    kind: "numberList",
  },
  {
    id: "queryFermentationTemperatureCoordinate",
    label: "Query fermentation temperature coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedFermentationTemperatureCoordinates,
    input.callerMatchedFermentationTemperatureResponses,
    "observedFermentationTemperatureCoordinates",
  );
  const v = curve(
    input.observedFermentationTemperatureCoordinates,
    input.callerMatchedFermentationTemperatureResponses,
    input.queryFermentationTemperatureCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFermentationTemperatureCoordinates: [10, 20, 30],
  callerMatchedFermentationTemperatureResponses: [20, 10, 5],
  queryFermentationTemperatureCoordinate: 25,
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
  id: "cooking/fermentation-time-adjustment",
  title: "Cooking Fermentation Time Adjustment Calculator",
  description:
    "Matched actual fermentation-time/temperature calibration for same inoculum/formula and explicitly measured endpoint. Conditional independently matched piecewise-linear calibration, no extrapolation. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedFermentationTemperatureCoordinates:
        value.observedFermentationTemperatureCoordinates as readonly number[],
      callerMatchedFermentationTemperatureResponses:
        value.callerMatchedFermentationTemperatureResponses as readonly number[],
      queryFermentationTemperatureCoordinate:
        value.queryFermentationTemperatureCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
