import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedSourdoughBulkTemperatureCoordinates: readonly number[];
  readonly callerMatchedSourdoughBulkTemperatureResponses: readonly number[];
  readonly querySourdoughBulkTemperatureCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedSourdoughBulkTemperatureCoordinates",
    label: "Observed sourdough bulk temperature coordinates",
    kind: "numberList",
  },
  {
    id: "callerMatchedSourdoughBulkTemperatureResponses",
    label: "Caller matched sourdough bulk temperature responses",
    kind: "numberList",
  },
  {
    id: "querySourdoughBulkTemperatureCoordinate",
    label: "Query sourdough bulk temperature coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedSourdoughBulkTemperatureCoordinates,
    input.callerMatchedSourdoughBulkTemperatureResponses,
    "observedSourdoughBulkTemperatureCoordinates",
  );
  const v = curve(
    input.observedSourdoughBulkTemperatureCoordinates,
    input.callerMatchedSourdoughBulkTemperatureResponses,
    input.querySourdoughBulkTemperatureCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSourdoughBulkTemperatureCoordinates: [10, 20, 30],
  callerMatchedSourdoughBulkTemperatureResponses: [20, 10, 5],
  querySourdoughBulkTemperatureCoordinate: 25,
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
  id: "cooking/sourdough-bulk-fermentation-time",
  title: "Cooking Sourdough Bulk Fermentation Time Calculator",
  description:
    "Observed bulk-fermentation volume endpoint times under matched starter/formula and temperature. Conditional independently matched piecewise-linear calibration, no extrapolation. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedSourdoughBulkTemperatureCoordinates:
        value.observedSourdoughBulkTemperatureCoordinates as readonly number[],
      callerMatchedSourdoughBulkTemperatureResponses:
        value.callerMatchedSourdoughBulkTemperatureResponses as readonly number[],
      querySourdoughBulkTemperatureCoordinate:
        value.querySourdoughBulkTemperatureCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
