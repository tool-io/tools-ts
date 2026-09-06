import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, curve } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly observedLetterpressSquashCoordinates: readonly number[];
  readonly independentlyMatchedLetterpressSquashResponses: readonly number[];
  readonly queryLetterpressSquashCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedLetterpressSquashCoordinates",
    label: "Observed letterpress squash coordinates",
    kind: "numberList",
  },
  {
    id: "independentlyMatchedLetterpressSquashResponses",
    label: "Independently matched letterpress squash responses",
    kind: "numberList",
  },
  {
    id: "queryLetterpressSquashCoordinate",
    label: "Query letterpress squash coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const v = curve(
    input.observedLetterpressSquashCoordinates,
    input.independentlyMatchedLetterpressSquashResponses,
    input.queryLetterpressSquashCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLetterpressSquashCoordinates: [1, 2, 3],
  independentlyMatchedLetterpressSquashResponses: [2, 4, 8],
  queryLetterpressSquashCoordinate: 2.5,
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
  id: "philately/letterpress-squash-rater",
  title: "Typographed Letterpress Impression Squash Rater",
  description:
    "Map observed letterpress impression squash to caller matched print calibration. Matched piecewise-linear calibration, no extrapolation or universal thresholds. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      observedLetterpressSquashCoordinates:
        value.observedLetterpressSquashCoordinates as readonly number[],
      independentlyMatchedLetterpressSquashResponses:
        value.independentlyMatchedLetterpressSquashResponses as readonly number[],
      queryLetterpressSquashCoordinate:
        value.queryLetterpressSquashCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
