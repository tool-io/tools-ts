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
  readonly observedPhosphorusLayerNumber: readonly number[];
  readonly observedMatchedPhosphorusGapEv: readonly number[];
  readonly queryPhosphorusLayerNumber: number;
}>;
export type Output = Readonly<{
  readonly interpolatedPhosphorusGapEv: number;
  readonly localMeasuredResponseDerivative: number;
}>;
const inputFields = [
  {
    id: "observedPhosphorusLayerNumber",
    label: "Observed phosphorus layer number",
    kind: "numberList",
  },
  {
    id: "observedMatchedPhosphorusGapEv",
    label: "Observed matched phosphorus gap ev",
    kind: "numberList",
  },
  {
    id: "queryPhosphorusLayerNumber",
    label: "Query phosphorus layer number",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedPhosphorusGapEv.forEach((v) =>
    positive(v, "observedMatchedPhosphorusGapEv"),
  );
  input.observedPhosphorusLayerNumber.forEach((v) =>
    bounded(v, "observedPhosphorusLayerNumber", 1, 1000),
  );
  bounded(
    input.queryPhosphorusLayerNumber,
    "queryPhosphorusLayerNumber",
    1,
    1000,
  );
  if (
    !input.observedPhosphorusLayerNumber.includes(
      input.queryPhosphorusLayerNumber,
    )
  )
    simpleError(
      "query",
      "Query layer count absent from actual discrete layer observations.",
    );
  const result = curve(
    input.observedPhosphorusLayerNumber,
    input.observedMatchedPhosphorusGapEv,
    input.queryPhosphorusLayerNumber,
  );
  return {
    interpolatedPhosphorusGapEv: result.value,
    localMeasuredResponseDerivative: result.slope,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPhosphorusLayerNumber: [1, 2, 3],
  observedMatchedPhosphorusGapEv: [2, 4, 8],
  queryPhosphorusLayerNumber: 2,
} satisfies Input;
export const exampleOutput = {
  interpolatedPhosphorusGapEv: 4,
  localMeasuredResponseDerivative: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/black-phosphorus-bandgap-vs-layer-number",
  title: "Semiconductor Black Phosphorus Bandgap Vs Layer Number Calculator",
  description:
    "Read actual discrete black-phosphorus layer-gap observations, query must be an observed integer layer count; report neighboring secant slope (right at interior points, left at final point), not fractional-layer interpolation or universal layer power law. No process recipe or safety claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedPhosphorusGapEv",
      label: "Interpolated phosphorus gap ev",
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
      observedPhosphorusLayerNumber:
        value.observedPhosphorusLayerNumber as readonly number[],
      observedMatchedPhosphorusGapEv:
        value.observedMatchedPhosphorusGapEv as readonly number[],
      queryPhosphorusLayerNumber: value.queryPhosphorusLayerNumber as number,
    }),
});
export const run = tool.execute;
export default tool;
