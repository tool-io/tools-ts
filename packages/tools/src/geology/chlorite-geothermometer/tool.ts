import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedChloriteCompositionCoordinates: readonly number[];
  readonly callerMatchedChloriteCompositionResponses: readonly number[];
  readonly queryChloriteCompositionCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedChloriteCompositionCoordinates",
    label: "Observed chlorite composition coordinates",
    kind: "numberList",
  },
  {
    id: "callerMatchedChloriteCompositionResponses",
    label: "Caller matched chlorite composition responses",
    kind: "numberList",
  },
  {
    id: "queryChloriteCompositionCoordinate",
    label: "Query chlorite composition coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedChloriteCompositionCoordinates,
    input.callerMatchedChloriteCompositionResponses,
    "observedChloriteCompositionCoordinates",
  );
  const f = curve(
    input.observedChloriteCompositionCoordinates,
    input.callerMatchedChloriteCompositionResponses,
    input.queryChloriteCompositionCoordinate,
  );
  return { interpolatedResponse: f.value, localObservedSlope: f.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedChloriteCompositionCoordinates: [1, 2, 3],
  callerMatchedChloriteCompositionResponses: [2, 4, 8],
  queryChloriteCompositionCoordinate: 2.5,
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
  id: "geology/chlorite-geothermometer",
  title: "Geology Chlorite Geothermometer Calculator",
  description:
    "Chlorite composition/temperature conditional same-site calibrated thermometer; caller establishes formula normalization/Fe corrections. Conditional independently matched piecewise-linear calibration, no extrapolation. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      observedChloriteCompositionCoordinates:
        value.observedChloriteCompositionCoordinates as readonly number[],
      callerMatchedChloriteCompositionResponses:
        value.callerMatchedChloriteCompositionResponses as readonly number[],
      queryChloriteCompositionCoordinate:
        value.queryChloriteCompositionCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
