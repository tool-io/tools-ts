import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  bounded,
  curve,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedMos2LayerNumber: readonly number[];
  readonly observedMatchedMos2Mobility: readonly number[];
  readonly queryMos2LayerNumber: number;
}>;
export type Output = Readonly<{
  readonly interpolatedMos2Mobility: number;
  readonly localMeasuredResponseDerivative: number;
}>;
const inputFields = [
  {
    id: "observedMos2LayerNumber",
    label: "Observed mos2 layer number",
    kind: "numberList",
  },
  {
    id: "observedMatchedMos2Mobility",
    label: "Observed matched mos2 mobility",
    kind: "numberList",
  },
  {
    id: "queryMos2LayerNumber",
    label: "Query mos2 layer number",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedMos2Mobility.forEach((v) =>
    positive(v, "observedMatchedMos2Mobility"),
  );
  input.observedMos2LayerNumber.forEach((v) =>
    bounded(v, "observedMos2LayerNumber", 1, 1000),
  );
  bounded(input.queryMos2LayerNumber, "queryMos2LayerNumber", 1, 1000);
  if (!input.observedMos2LayerNumber.includes(input.queryMos2LayerNumber))
    simpleError(
      "query",
      "Query layer count absent from actual discrete layer observations.",
    );
  const result = curve(
    input.observedMos2LayerNumber,
    input.observedMatchedMos2Mobility,
    input.queryMos2LayerNumber,
  );
  return {
    interpolatedMos2Mobility: result.value,
    localMeasuredResponseDerivative: result.slope,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMos2LayerNumber: [1, 2, 3],
  observedMatchedMos2Mobility: [2, 4, 8],
  queryMos2LayerNumber: 2,
} satisfies Input;
export const exampleOutput = {
  interpolatedMos2Mobility: 4,
  localMeasuredResponseDerivative: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/mos2-mobility-vs-layer-number",
  title: "Semiconductor Mos2 Mobility Vs Layer Number Calculator",
  description:
    "Read actual discrete MoS2 layer-mobility observations, query must be an observed integer layer count; report neighboring secant slope (right at interior points, left at final point), not fractional-layer interpolation or fabricated material law. No process recipe or safety claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedMos2Mobility",
      label: "Interpolated mos2 mobility",
      kind: "number",
    },
    {
      id: "localMeasuredResponseDerivative",
      label: "Local measured response derivative",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMos2LayerNumber:
        value.observedMos2LayerNumber as readonly number[],
      observedMatchedMos2Mobility:
        value.observedMatchedMos2Mobility as readonly number[],
      queryMos2LayerNumber: value.queryMos2LayerNumber as number,
    }),
});
export const run = tool.execute;
export default tool;
