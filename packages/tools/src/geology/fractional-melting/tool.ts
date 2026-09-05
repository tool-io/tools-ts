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
  nonnegative,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly initialTrace: number;
  readonly bulkPartition: number;
  readonly extractedFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly accumulatedMelt: readonly number[];
  readonly instantaneousMelt: readonly number[];
}>;
const inputFields = [
  { id: "initialTrace", label: "Initial trace", kind: "number" },
  { id: "bulkPartition", label: "Bulk partition", kind: "number" },
  {
    id: "extractedFractions",
    label: "Extracted fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.bulkPartition, "bulkPartition");
  nonnegative(input.initialTrace, "initialTrace");
  input.extractedFractions.forEach((f) => {
    if (f <= 0 || f >= 1) simpleError("F", "Strict0<F<1.");
  });
  const c = input.initialTrace,
    d = input.bulkPartition;
  return {
    accumulatedMelt: input.extractedFractions.map(
      (f) => (-c * Math.expm1(Math.log1p(-f) / d)) / f,
    ),
    instantaneousMelt: input.extractedFractions.map(
      (f) => (c / d) * Math.exp((1 / d - 1) * Math.log1p(-f)),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  initialTrace: 10,
  bulkPartition: 0.5,
  extractedFractions: [0.5, 0.75],
} satisfies Input;
export const exampleOutput = {
  accumulatedMelt: [15, 12.5],
  instantaneousMelt: [10, 5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/fractional-melting",
  title: "Geology Fractional Melting Calculator",
  description:
    "Perfect fractional extraction accumulated/instantaneous melts; constant bulkD, distinct from residual-liquid Rayleigh crystal fractionation. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "accumulatedMelt", label: "Accumulated melt", kind: "numberList" },
    {
      id: "instantaneousMelt",
      label: "Instantaneous melt",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      initialTrace: value.initialTrace as number,
      bulkPartition: value.bulkPartition as number,
      extractedFractions: value.extractedFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
