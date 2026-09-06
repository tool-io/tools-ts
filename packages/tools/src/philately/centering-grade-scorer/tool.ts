import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, curve } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly observedCenteringBalanceCoordinates: readonly number[];
  readonly independentlyMatchedCenteringBalanceResponses: readonly number[];
  readonly queryCenteringBalanceCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedCenteringBalanceCoordinates",
    label: "Observed centering balance coordinates",
    kind: "numberList",
  },
  {
    id: "independentlyMatchedCenteringBalanceResponses",
    label: "Independently matched centering balance responses",
    kind: "numberList",
  },
  {
    id: "queryCenteringBalanceCoordinate",
    label: "Query centering balance coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const v = curve(
    input.observedCenteringBalanceCoordinates,
    input.independentlyMatchedCenteringBalanceResponses,
    input.queryCenteringBalanceCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCenteringBalanceCoordinates: [1, 2, 3],
  independentlyMatchedCenteringBalanceResponses: [2, 4, 8],
  queryCenteringBalanceCoordinate: 2.5,
} satisfies Input;
export const exampleOutput = {
  interpolatedResponse: 6,
  localObservedSlope: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/centering-grade-scorer",
  title: "Centering Grade Scorer (superb 95 to poor 10)",
  description:
    "Map independently measured centering balance to independently supplied grading-service calibration;95to10 title is not a universal scale. Matched piecewise-linear calibration, no extrapolation or universal thresholds. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      observedCenteringBalanceCoordinates:
        value.observedCenteringBalanceCoordinates as readonly number[],
      independentlyMatchedCenteringBalanceResponses:
        value.independentlyMatchedCenteringBalanceResponses as readonly number[],
      queryCenteringBalanceCoordinate:
        value.queryCenteringBalanceCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
