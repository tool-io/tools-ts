import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedJrcProfileRoughnessCoordinates: readonly number[];
  readonly callerMatchedJrcProfileRoughnessResponses: readonly number[];
  readonly queryJrcProfileRoughnessCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedJrcProfileRoughnessCoordinates",
    label: "Observed jrc profile roughness coordinates",
    kind: "numberList",
  },
  {
    id: "callerMatchedJrcProfileRoughnessResponses",
    label: "Caller matched jrc profile roughness responses",
    kind: "numberList",
  },
  {
    id: "queryJrcProfileRoughnessCoordinate",
    label: "Query jrc profile roughness coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedJrcProfileRoughnessCoordinates,
    input.callerMatchedJrcProfileRoughnessResponses,
    "observedJrcProfileRoughnessCoordinates",
  );
  const f = curve(
    input.observedJrcProfileRoughnessCoordinates,
    input.callerMatchedJrcProfileRoughnessResponses,
    input.queryJrcProfileRoughnessCoordinate,
  );
  return { interpolatedResponse: f.value, localObservedSlope: f.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedJrcProfileRoughnessCoordinates: [1, 2, 3],
  callerMatchedJrcProfileRoughnessResponses: [2, 4, 8],
  queryJrcProfileRoughnessCoordinate: 2.5,
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
  id: "geology/joint-roughness-coefficient-jrc",
  title: "Geology Joint Roughness Coefficient Jrc Calculator",
  description:
    "JRC interpolation from caller independently measured same-scale/sampling roughness coordinates and verified JRC calibration, no universal visual JRC estimator. Conditional independently matched piecewise-linear calibration, no extrapolation. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      observedJrcProfileRoughnessCoordinates:
        value.observedJrcProfileRoughnessCoordinates as readonly number[],
      callerMatchedJrcProfileRoughnessResponses:
        value.callerMatchedJrcProfileRoughnessResponses as readonly number[],
      queryJrcProfileRoughnessCoordinate:
        value.queryJrcProfileRoughnessCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
