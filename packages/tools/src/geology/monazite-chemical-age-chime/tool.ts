import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedMonazitePbThUEquivalentCoordinates: readonly number[];
  readonly callerMatchedMonazitePbThUEquivalentResponses: readonly number[];
  readonly queryMonazitePbThUEquivalentCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedMonazitePbThUEquivalentCoordinates",
    label: "Observed monazite pb th u equivalent coordinates",
    kind: "numberList",
  },
  {
    id: "callerMatchedMonazitePbThUEquivalentResponses",
    label: "Caller matched monazite pb th u equivalent responses",
    kind: "numberList",
  },
  {
    id: "queryMonazitePbThUEquivalentCoordinate",
    label: "Query monazite pb th u equivalent coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedMonazitePbThUEquivalentCoordinates,
    input.callerMatchedMonazitePbThUEquivalentResponses,
    "observedMonazitePbThUEquivalentCoordinates",
  );
  const f = curve(
    input.observedMonazitePbThUEquivalentCoordinates,
    input.callerMatchedMonazitePbThUEquivalentResponses,
    input.queryMonazitePbThUEquivalentCoordinate,
  );
  return { interpolatedResponse: f.value, localObservedSlope: f.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMonazitePbThUEquivalentCoordinates: [1, 2, 3],
  callerMatchedMonazitePbThUEquivalentResponses: [2, 4, 8],
  queryMonazitePbThUEquivalentCoordinate: 2.5,
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
  id: "geology/monazite-chemical-age-chime",
  title: "Geology Monazite Chemical Age Chime Calculator",
  description:
    "CHIME conditional chemical age from independently matched monazite total-Pb/Th/U equivalent chemical-age calibration, common-Pb/decay/oxide basis externally fixed. Conditional independently matched piecewise-linear calibration, no extrapolation. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      observedMonazitePbThUEquivalentCoordinates:
        value.observedMonazitePbThUEquivalentCoordinates as readonly number[],
      callerMatchedMonazitePbThUEquivalentResponses:
        value.callerMatchedMonazitePbThUEquivalentResponses as readonly number[],
      queryMonazitePbThUEquivalentCoordinate:
        value.queryMonazitePbThUEquivalentCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
