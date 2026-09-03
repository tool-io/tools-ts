import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedTurkeyProcessMassCoordinates: readonly number[];
  readonly callerMatchedTurkeyProcessMassResponses: readonly number[];
  readonly queryTurkeyProcessMassCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedTurkeyProcessMassCoordinates",
    label: "Observed turkey process mass coordinates",
    kind: "numberList",
  },
  {
    id: "callerMatchedTurkeyProcessMassResponses",
    label: "Caller matched turkey process mass responses",
    kind: "numberList",
  },
  {
    id: "queryTurkeyProcessMassCoordinate",
    label: "Query turkey process mass coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedTurkeyProcessMassCoordinates,
    input.callerMatchedTurkeyProcessMassResponses,
    "observedTurkeyProcessMassCoordinates",
  );
  const v = curve(
    input.observedTurkeyProcessMassCoordinates,
    input.callerMatchedTurkeyProcessMassResponses,
    input.queryTurkeyProcessMassCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTurkeyProcessMassCoordinates: [10, 20, 30],
  callerMatchedTurkeyProcessMassResponses: [20, 10, 5],
  queryTurkeyProcessMassCoordinate: 25,
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
  id: "cooking/turkey-roast-time",
  title: "Cooking Turkey Roast Time Calculator",
  description:
    "Same geometry/start/bath/oven conditions actual turkey endpoint time vs mass, not food-safety roast chart. Conditional independently matched piecewise-linear calibration, no extrapolation. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedTurkeyProcessMassCoordinates:
        value.observedTurkeyProcessMassCoordinates as readonly number[],
      callerMatchedTurkeyProcessMassResponses:
        value.callerMatchedTurkeyProcessMassResponses as readonly number[],
      queryTurkeyProcessMassCoordinate:
        value.queryTurkeyProcessMassCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
