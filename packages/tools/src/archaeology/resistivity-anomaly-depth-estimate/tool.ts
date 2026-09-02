import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, curve } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedResistivityAnomalyDepthCoordinates: readonly number[];
  readonly independentlyMatchedResistivityAnomalyDepthResponses: readonly number[];
  readonly queryResistivityAnomalyDepthCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedResistivityAnomalyDepthCoordinates",
    label: "Observed resistivity anomaly depth coordinates",
    kind: "numberList",
  },
  {
    id: "independentlyMatchedResistivityAnomalyDepthResponses",
    label: "Independently matched resistivity anomaly depth responses",
    kind: "numberList",
  },
  {
    id: "queryResistivityAnomalyDepthCoordinate",
    label: "Query resistivity anomaly depth coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const v = curve(
    input.observedResistivityAnomalyDepthCoordinates,
    input.independentlyMatchedResistivityAnomalyDepthResponses,
    input.queryResistivityAnomalyDepthCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedResistivityAnomalyDepthCoordinates: [1, 2, 3],
  independentlyMatchedResistivityAnomalyDepthResponses: [2, 4, 8],
  queryResistivityAnomalyDepthCoordinate: 2.5,
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
  id: "archaeology/resistivity-anomaly-depth-estimate",
  title: "Resistivity Anomaly Depth Estimate",
  description:
    "Independently site/array/geometry-matched resistivity response/depth calibration, not depth from universal amplitude factor. Matched piecewise-linear observational calibration with no extrapolation. Caller independently establishes sample/context/calibration applicability; not definitive chronology, provenance, taxonomy, disease or human identity.",
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
      observedResistivityAnomalyDepthCoordinates:
        value.observedResistivityAnomalyDepthCoordinates as readonly number[],
      independentlyMatchedResistivityAnomalyDepthResponses:
        value.independentlyMatchedResistivityAnomalyDepthResponses as readonly number[],
      queryResistivityAnomalyDepthCoordinate:
        value.queryResistivityAnomalyDepthCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
