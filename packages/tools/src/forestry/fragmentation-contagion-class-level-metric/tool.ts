import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, count, shape } from "../shared.js";
export type Input = Readonly<{
  readonly classProportions: readonly number[];
  readonly directedAdjacencyCounts: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly contagionPercent: number;
  readonly jointAdjacencyEntropyNats: number;
}>;
const inputFields = [
  { id: "classProportions", label: "Class proportions", kind: "numberList" },
  {
    id: "directedAdjacencyCounts",
    label: "Directed adjacency counts",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.classProportions.forEach((v) => positive(v, "classProportions"));
  const m = shape(input.directedAdjacencyCounts, "directedAdjacencyCounts");
  if (
    m < 2 ||
    input.directedAdjacencyCounts.length !== m ||
    input.classProportions.length !== m ||
    Math.abs(input.classProportions.reduce((a, b) => a + b, 0) - 1) > 1e-10
  )
    simpleError(
      "classes",
      "At least two classes, square adjacency and positive class proportions summing to one required.",
    );
  let sum = 0;
  input.directedAdjacencyCounts.forEach((row, i) => {
    row.forEach((v) => count(v, "adjacency"));
    const total = positive(
      row.reduce((a, b) => a + b, 0),
      "adjacencyRow",
    );
    row.forEach((v) => {
      const q = (input.classProportions[i] * v) / total;
      if (q > 0) sum += q * Math.log(q);
    });
  });
  return {
    contagionPercent: 100 * (1 + sum / (2 * Math.log(m))),
    jointAdjacencyEntropyNats: -sum,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  classProportions: [0.5, 0.5],
  directedAdjacencyCounts: [
    [1, 1],
    [1, 1],
  ],
} satisfies Input;
export const exampleOutput = {
  contagionPercent: 0,
  jointAdjacencyEntropyNats: 1.3862943611198906,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/fragmentation-contagion-class-level-metric",
  title: "Class-Level Contagion Fragmentation Metric",
  description:
    "Compute named class contagion from supplied class proportions and directed adjacency counts, omitting zero probability log terms; no raster processing/geodesy and adjacency counting convention must remain consistent.",
  inputs: inputFields,
  outputs: [
    { id: "contagionPercent", label: "Contagion percent", kind: "number" },
    {
      id: "jointAdjacencyEntropyNats",
      label: "Joint adjacency entropy nats",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      classProportions: value.classProportions as readonly number[],
      directedAdjacencyCounts:
        value.directedAdjacencyCounts as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
