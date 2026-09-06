import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, curve } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly observedResearchDepthCoordinates: readonly number[];
  readonly independentlyMatchedResearchDepthResponses: readonly number[];
  readonly queryResearchDepthCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedResearchDepthCoordinates",
    label: "Observed research depth coordinates",
    kind: "numberList",
  },
  {
    id: "independentlyMatchedResearchDepthResponses",
    label: "Independently matched research depth responses",
    kind: "numberList",
  },
  {
    id: "queryResearchDepthCoordinate",
    label: "Query research depth coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const v = curve(
    input.observedResearchDepthCoordinates,
    input.independentlyMatchedResearchDepthResponses,
    input.queryResearchDepthCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedResearchDepthCoordinates: [1, 2, 3],
  independentlyMatchedResearchDepthResponses: [2, 4, 8],
  queryResearchDepthCoordinate: 2.5,
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
  id: "philately/exhibit-knowledge-point-rater",
  title: "Exhibit Knowledge Research Depth Point Rater",
  description:
    "Map independently assessed research evidence to caller exhibit-point rubric. Matched piecewise-linear calibration, no extrapolation or universal thresholds. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      observedResearchDepthCoordinates:
        value.observedResearchDepthCoordinates as readonly number[],
      independentlyMatchedResearchDepthResponses:
        value.independentlyMatchedResearchDepthResponses as readonly number[],
      queryResearchDepthCoordinate:
        value.queryResearchDepthCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
