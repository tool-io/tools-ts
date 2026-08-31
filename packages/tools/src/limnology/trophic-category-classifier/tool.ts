import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  unique,
  strictlyIncreasing,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly observedTsi: number;
  readonly callerUpperInclusiveTsiEdges: readonly number[];
  readonly callerCategoryLabels: readonly string[];
}>;
export type Output = Readonly<{
  readonly callerTrophicCategory: string;
  readonly callerCategoryIndex: number;
}>;
const inputFields = [
  { id: "observedTsi", label: "Observed tsi", kind: "number" },
  {
    id: "callerUpperInclusiveTsiEdges",
    label: "Caller upper inclusive tsi edges",
    kind: "numberList",
  },
  {
    id: "callerCategoryLabels",
    label: "Caller category labels",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  strictlyIncreasing(input.callerUpperInclusiveTsiEdges, "edges", 1);
  if (
    input.callerCategoryLabels.length !==
    input.callerUpperInclusiveTsiEdges.length + 1
  )
    simpleError(
      "categories",
      "One extra category beyond upper-inclusive caller edges required.",
    );
  unique(input.callerCategoryLabels, "labels");
  const first = input.callerUpperInclusiveTsiEdges.findIndex(
      (v) => input.observedTsi <= v,
    ),
    index = first < 0 ? input.callerUpperInclusiveTsiEdges.length : first;
  return {
    callerTrophicCategory: input.callerCategoryLabels[index],
    callerCategoryIndex: index,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTsi: 50,
  callerUpperInclusiveTsiEdges: [40, 50, 70],
  callerCategoryLabels: ["low", "middle", "high", "very high"],
} satisfies Input;
export const exampleOutput = {
  callerTrophicCategory: "middle",
  callerCategoryIndex: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/trophic-category-classifier",
  title: "Trophic Category Classifier",
  description:
    "Map actual TSI to explicit caller upper-inclusive category scheme; no universal trophic labels, compound-index completeness or ecological endpoint diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerTrophicCategory",
      label: "Caller trophic category",
      kind: "string",
    },
    {
      id: "callerCategoryIndex",
      label: "Caller category index",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTsi: value.observedTsi as number,
      callerUpperInclusiveTsiEdges:
        value.callerUpperInclusiveTsiEdges as readonly number[],
      callerCategoryLabels: value.callerCategoryLabels as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
