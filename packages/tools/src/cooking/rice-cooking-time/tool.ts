import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedRiceProcessLoadCoordinates: readonly number[];
  readonly callerMatchedRiceProcessLoadResponses: readonly number[];
  readonly queryRiceProcessLoadCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedRiceProcessLoadCoordinates",
    label: "Observed rice process load coordinates",
    kind: "numberList",
  },
  {
    id: "callerMatchedRiceProcessLoadResponses",
    label: "Caller matched rice process load responses",
    kind: "numberList",
  },
  {
    id: "queryRiceProcessLoadCoordinate",
    label: "Query rice process load coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedRiceProcessLoadCoordinates,
    input.callerMatchedRiceProcessLoadResponses,
    "observedRiceProcessLoadCoordinates",
  );
  const v = curve(
    input.observedRiceProcessLoadCoordinates,
    input.callerMatchedRiceProcessLoadResponses,
    input.queryRiceProcessLoadCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRiceProcessLoadCoordinates: [10, 20, 30],
  callerMatchedRiceProcessLoadResponses: [20, 10, 5],
  queryRiceProcessLoadCoordinate: 25,
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
  id: "cooking/rice-cooking-time",
  title: "Cooking Rice Cooking Time Calculator",
  description:
    "Rice process time vs independently measured same grain/hydration/appliance load at a defined endpoint. Conditional independently matched piecewise-linear calibration, no extrapolation. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedRiceProcessLoadCoordinates:
        value.observedRiceProcessLoadCoordinates as readonly number[],
      callerMatchedRiceProcessLoadResponses:
        value.callerMatchedRiceProcessLoadResponses as readonly number[],
      queryRiceProcessLoadCoordinate:
        value.queryRiceProcessLoadCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
