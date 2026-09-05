import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, normalizeChi } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly spontaneousCounts: readonly number[];
  readonly inducedCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly pearsonStatistic: number;
  readonly degreesOfFreedom: number;
}>;
const inputFields = [
  { id: "spontaneousCounts", label: "Spontaneous counts", kind: "numberList" },
  { id: "inducedCounts", label: "Induced counts", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return normalizeChi(input.spontaneousCounts, input.inducedCounts);
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  spontaneousCounts: [10, 20],
  inducedCounts: [10, 20],
} satisfies Input;
export const exampleOutput = {
  pearsonStatistic: 0,
  degreesOfFreedom: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/fission-track-chi-square-test",
  title: "Geology Fission Track Chi Square Test Calculator",
  description:
    "Pearson grain×track-origin contingency homogeneity statistic; explicit integer counts, no automatic central-age validity or chi-square p approximation. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "pearsonStatistic", label: "Pearson statistic", kind: "number" },
    { id: "degreesOfFreedom", label: "Degrees of freedom", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      spontaneousCounts: value.spontaneousCounts as readonly number[],
      inducedCounts: value.inducedCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
