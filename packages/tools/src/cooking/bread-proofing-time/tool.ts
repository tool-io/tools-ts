import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedBreadProofTemperatureCoordinates: readonly number[];
  readonly callerMatchedBreadProofTemperatureResponses: readonly number[];
  readonly queryBreadProofTemperatureCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedBreadProofTemperatureCoordinates",
    label: "Observed bread proof temperature coordinates",
    kind: "numberList",
  },
  {
    id: "callerMatchedBreadProofTemperatureResponses",
    label: "Caller matched bread proof temperature responses",
    kind: "numberList",
  },
  {
    id: "queryBreadProofTemperatureCoordinate",
    label: "Query bread proof temperature coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedBreadProofTemperatureCoordinates,
    input.callerMatchedBreadProofTemperatureResponses,
    "observedBreadProofTemperatureCoordinates",
  );
  const v = curve(
    input.observedBreadProofTemperatureCoordinates,
    input.callerMatchedBreadProofTemperatureResponses,
    input.queryBreadProofTemperatureCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBreadProofTemperatureCoordinates: [10, 20, 30],
  callerMatchedBreadProofTemperatureResponses: [20, 10, 5],
  queryBreadProofTemperatureCoordinate: 25,
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
  id: "cooking/bread-proofing-time",
  title: "Cooking Bread Proofing Time Calculator",
  description:
    "Observed bread proofing endpoint times under matched formula/inoculum and temperature. Conditional independently matched piecewise-linear calibration, no extrapolation. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedBreadProofTemperatureCoordinates:
        value.observedBreadProofTemperatureCoordinates as readonly number[],
      callerMatchedBreadProofTemperatureResponses:
        value.callerMatchedBreadProofTemperatureResponses as readonly number[],
      queryBreadProofTemperatureCoordinate:
        value.queryBreadProofTemperatureCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
