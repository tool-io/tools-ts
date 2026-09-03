import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, curve } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedScreenFrequencyDotGainCoordinates: readonly number[];
  readonly independentlyMatchedScreenFrequencyDotGainResponses: readonly number[];
  readonly queryScreenFrequencyDotGainCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedScreenFrequencyDotGainCoordinates",
    label: "Observed screen frequency dot gain coordinates",
    kind: "numberList",
  },
  {
    id: "independentlyMatchedScreenFrequencyDotGainResponses",
    label: "Independently matched screen frequency dot gain responses",
    kind: "numberList",
  },
  {
    id: "queryScreenFrequencyDotGainCoordinate",
    label: "Query screen frequency dot gain coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const v = curve(
    input.observedScreenFrequencyDotGainCoordinates,
    input.independentlyMatchedScreenFrequencyDotGainResponses,
    input.queryScreenFrequencyDotGainCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedScreenFrequencyDotGainCoordinates: [1, 2, 3],
  independentlyMatchedScreenFrequencyDotGainResponses: [2, 4, 8],
  queryScreenFrequencyDotGainCoordinate: 2.5,
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
  id: "color/screen-frequency-lpi-dot-gain-estimate",
  title: "Screen Frequency LPI Dot-Gain Estimate",
  description:
    "Matched same press/substrate/tone actual screen-frequency vs independently assayed tone-value increase, signed dot-gain evidence allowed. Matched piecewise-linear observational calibration with no extrapolation. Explicit declared color space/reference and caller applicability; not spectral equivalence, pigment mixing, press readiness or accessibility certification.",
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
      observedScreenFrequencyDotGainCoordinates:
        value.observedScreenFrequencyDotGainCoordinates as readonly number[],
      independentlyMatchedScreenFrequencyDotGainResponses:
        value.independentlyMatchedScreenFrequencyDotGainResponses as readonly number[],
      queryScreenFrequencyDotGainCoordinate:
        value.queryScreenFrequencyDotGainCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
