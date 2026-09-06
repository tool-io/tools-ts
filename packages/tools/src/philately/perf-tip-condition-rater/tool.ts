import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, curve } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly observedPerfTipDamageCoordinates: readonly number[];
  readonly independentlyMatchedPerfTipDamageResponses: readonly number[];
  readonly queryPerfTipDamageCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedPerfTipDamageCoordinates",
    label: "Observed perf tip damage coordinates",
    kind: "numberList",
  },
  {
    id: "independentlyMatchedPerfTipDamageResponses",
    label: "Independently matched perf tip damage responses",
    kind: "numberList",
  },
  {
    id: "queryPerfTipDamageCoordinate",
    label: "Query perf tip damage coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const v = curve(
    input.observedPerfTipDamageCoordinates,
    input.independentlyMatchedPerfTipDamageResponses,
    input.queryPerfTipDamageCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPerfTipDamageCoordinates: [1, 2, 3],
  independentlyMatchedPerfTipDamageResponses: [2, 4, 8],
  queryPerfTipDamageCoordinate: 2.5,
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
  id: "philately/perf-tip-condition-rater",
  title: "Perf Tip Condition Deduction Rater",
  description:
    "Rate observed perf-tip loss under a matched caller grading calibration. Matched piecewise-linear calibration, no extrapolation or universal thresholds. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      observedPerfTipDamageCoordinates:
        value.observedPerfTipDamageCoordinates as readonly number[],
      independentlyMatchedPerfTipDamageResponses:
        value.independentlyMatchedPerfTipDamageResponses as readonly number[],
      queryPerfTipDamageCoordinate:
        value.queryPerfTipDamageCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
