import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, count } from "../shared.js";
export type Input = Readonly<{
  readonly classifiedPetrographicCounts: readonly number[];
  readonly unclassifiedPointCount: number;
}>;
export type Output = Readonly<{
  readonly classifiedCategoryPercentages: readonly number[];
  readonly unclassifiedPercentOfAllPoints: number;
  readonly classifiedPointCount: number;
}>;
const inputFields = [
  {
    id: "classifiedPetrographicCounts",
    label: "Classified petrographic counts",
    kind: "numberList",
  },
  {
    id: "unclassifiedPointCount",
    label: "Unclassified point count",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.classifiedPetrographicCounts.forEach((v) =>
    count(v, "classifiedPetrographicCounts"),
  );
  count(input.unclassifiedPointCount, "unclassifiedPointCount");
  const classifiedPointCount = positive(
    input.classifiedPetrographicCounts.reduce((a, b) => a + b, 0),
    "classifiedPetrographicCounts",
  );
  return {
    classifiedCategoryPercentages: input.classifiedPetrographicCounts.map(
      (v) => (100 * v) / classifiedPointCount,
    ),
    unclassifiedPercentOfAllPoints:
      (100 * input.unclassifiedPointCount) /
      (classifiedPointCount + input.unclassifiedPointCount),
    classifiedPointCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  classifiedPetrographicCounts: [10, 20, 30],
  unclassifiedPointCount: 10,
} satisfies Input;
export const exampleOutput = {
  classifiedCategoryPercentages: [16.666666666666668, 33.333333333333336, 50],
  unclassifiedPercentOfAllPoints: 14.285714285714286,
  classifiedPointCount: 60,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/ceramic-petrographic-point-count",
  title: "Ceramic Petrographic Point Count Tool",
  description:
    "Normalize classified ceramic petrographic point counts while preserving unclassified sample coverage; volume interpretation requires representative random section sampling, not inferred provenance.",
  inputs: inputFields,
  outputs: [
    {
      id: "classifiedCategoryPercentages",
      label: "Classified category percentages",
      kind: "numberList",
    },
    {
      id: "unclassifiedPercentOfAllPoints",
      label: "Unclassified percent of all points",
      kind: "number",
    },
    {
      id: "classifiedPointCount",
      label: "Classified point count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      classifiedPetrographicCounts:
        value.classifiedPetrographicCounts as readonly number[],
      unclassifiedPointCount: value.unclassifiedPointCount as number,
    }),
});
export const run = tool.execute;
export default tool;
