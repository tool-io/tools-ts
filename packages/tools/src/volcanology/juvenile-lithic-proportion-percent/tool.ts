import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, count, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly juvenileCounts: readonly number[];
  readonly lithicCounts: readonly number[];
  readonly unclassifiedCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly juvenilePercentOfClassified: number;
  readonly lithicPercentOfClassified: number;
  readonly unclassifiedPercentOfAll: number;
}>;
const inputFields = [
  { id: "juvenileCounts", label: "Juvenile counts", kind: "numberList" },
  { id: "lithicCounts", label: "Lithic counts", kind: "numberList" },
  {
    id: "unclassifiedCounts",
    label: "Unclassified counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.juvenileCounts.forEach((v) => count(v, "juvenileCounts"));
  input.lithicCounts.forEach((v) => count(v, "lithicCounts"));
  input.unclassifiedCounts.forEach((v) => count(v, "unclassifiedCounts"));
  aligned(input.juvenileCounts, input.lithicCounts, "juvenileCounts");
  aligned(input.juvenileCounts, input.unclassifiedCounts, "juvenileCounts");
  const j = input.juvenileCounts.reduce((a, b) => a + b, 0),
    l = input.lithicCounts.reduce((a, b) => a + b, 0),
    u = input.unclassifiedCounts.reduce((a, b) => a + b, 0),
    classified = positive(j + l, "classifiedCounts");
  return {
    juvenilePercentOfClassified: (100 * j) / classified,
    lithicPercentOfClassified: (100 * l) / classified,
    unclassifiedPercentOfAll: (100 * u) / (classified + u),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  juvenileCounts: [10, 20],
  lithicCounts: [5, 5],
  unclassifiedCounts: [5, 5],
} satisfies Input;
export const exampleOutput = {
  juvenilePercentOfClassified: 75,
  lithicPercentOfClassified: 25,
  unclassifiedPercentOfAll: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/juvenile-lithic-proportion-percent",
  title: "Juvenile Lithic Proportion Percent",
  description:
    "Pool observed juvenile/lithic clast counts using a classified denominator and retain unclassified coverage separately; count proportions are not mass or volume proportions.",
  inputs: inputFields,
  outputs: [
    {
      id: "juvenilePercentOfClassified",
      label: "Juvenile percent of classified",
      kind: "number",
    },
    {
      id: "lithicPercentOfClassified",
      label: "Lithic percent of classified",
      kind: "number",
    },
    {
      id: "unclassifiedPercentOfAll",
      label: "Unclassified percent of all",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      juvenileCounts: value.juvenileCounts as readonly number[],
      lithicCounts: value.lithicCounts as readonly number[],
      unclassifiedCounts: value.unclassifiedCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
