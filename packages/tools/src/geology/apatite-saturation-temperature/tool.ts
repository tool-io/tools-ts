import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedApatiteMeltCompositionCoordinates: readonly number[];
  readonly callerMatchedApatiteMeltCompositionResponses: readonly number[];
  readonly queryApatiteMeltCompositionCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedApatiteMeltCompositionCoordinates",
    label: "Observed apatite melt composition coordinates",
    kind: "numberList",
  },
  {
    id: "callerMatchedApatiteMeltCompositionResponses",
    label: "Caller matched apatite melt composition responses",
    kind: "numberList",
  },
  {
    id: "queryApatiteMeltCompositionCoordinate",
    label: "Query apatite melt composition coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedApatiteMeltCompositionCoordinates,
    input.callerMatchedApatiteMeltCompositionResponses,
    "observedApatiteMeltCompositionCoordinates",
  );
  const f = curve(
    input.observedApatiteMeltCompositionCoordinates,
    input.callerMatchedApatiteMeltCompositionResponses,
    input.queryApatiteMeltCompositionCoordinate,
  );
  return { interpolatedResponse: f.value, localObservedSlope: f.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedApatiteMeltCompositionCoordinates: [1, 2, 3],
  callerMatchedApatiteMeltCompositionResponses: [2, 4, 8],
  queryApatiteMeltCompositionCoordinate: 2.5,
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
  id: "geology/apatite-saturation-temperature",
  title: "Geology Apatite Saturation Temperature Calculator",
  description:
    "Apatite saturation temperature from independently fixed melt-composition same-chemistry phosphorus/temperature calibration; no universal apatite thermometer constants. Conditional independently matched piecewise-linear calibration, no extrapolation. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      observedApatiteMeltCompositionCoordinates:
        value.observedApatiteMeltCompositionCoordinates as readonly number[],
      callerMatchedApatiteMeltCompositionResponses:
        value.callerMatchedApatiteMeltCompositionResponses as readonly number[],
      queryApatiteMeltCompositionCoordinate:
        value.queryApatiteMeltCompositionCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
