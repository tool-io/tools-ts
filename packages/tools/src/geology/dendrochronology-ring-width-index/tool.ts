import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedRingWidths: readonly number[];
  readonly independentlyFittedExpectedWidths: readonly number[];
}>;
export type Output = Readonly<{ readonly ringWidthIndices: readonly number[] }>;
const inputFields = [
  {
    id: "observedRingWidths",
    label: "Observed ring widths",
    kind: "numberList",
  },
  {
    id: "independentlyFittedExpectedWidths",
    label: "Independently fitted expected widths",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.independentlyFittedExpectedWidths.forEach((v) =>
    positive(v, "independentlyFittedExpectedWidths"),
  );
  input.observedRingWidths.forEach((v) => nonnegative(v, "observedRingWidths"));
  aligned(
    input.observedRingWidths,
    input.independentlyFittedExpectedWidths,
    "observedRingWidths",
  );
  return {
    ringWidthIndices: input.observedRingWidths.map(
      (v, i) => v / input.independentlyFittedExpectedWidths[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRingWidths: [1, 4],
  independentlyFittedExpectedWidths: [2, 2],
} satisfies Input;
export const exampleOutput = { ringWidthIndices: [0.5, 2] } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/dendrochronology-ring-width-index",
  title: "Geology Dendrochronology Ring Width Index Calculator",
  description:
    "Measured/independently detrended expected ring-width indices, not invented detrending model or raw crossdating correlations. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "ringWidthIndices", label: "Ring width indices", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      observedRingWidths: value.observedRingWidths as readonly number[],
      independentlyFittedExpectedWidths:
        value.independentlyFittedExpectedWidths as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
