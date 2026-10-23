import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  unique,
  sum,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly independentlyMeasuredColorIds: readonly string[];
  readonly disjointColorAreas: readonly number[];
  readonly unknownUnsegmentedArea: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "independentlyMeasuredColorIds",
    label: "Independently measured color ids",
    kind: "stringList",
  },
  {
    id: "disjointColorAreas",
    label: "Disjoint color areas",
    kind: "numberList",
  },
  {
    id: "unknownUnsegmentedArea",
    label: "Unknown unsegmented area",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  unique(input.independentlyMeasuredColorIds, "colors");
  aligned(
    input.independentlyMeasuredColorIds,
    input.disjointColorAreas,
    "areas",
  );
  input.disjointColorAreas.forEach((v) => nonnegative(v, "area"));
  nonnegative(input.unknownUnsegmentedArea, "unknownarea");
  const total = positive(
      sum(input.disjointColorAreas) + input.unknownUnsegmentedArea,
      "totalarea",
    ),
    max = Math.max(...input.disjointColorAreas);
  return {
    dominantObservedColorIds: input.independentlyMeasuredColorIds.filter(
      (_, i) => input.disjointColorAreas[i] === max,
    ),
    observedColorAreaPercentages: input.disjointColorAreas.map(
      (v) => (100 * v) / total,
    ),
    unknownAreaPercentage: (100 * input.unknownUnsegmentedArea) / total,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredColorIds: ["red", "blue", "white"],
    disjointColorAreas: [2, 3, 3],
    unknownUnsegmentedArea: 2,
  },
  output: {
    result: {
      dominantObservedColorIds: ["blue", "white"],
      observedColorAreaPercentages: [20, 30, 30],
      unknownAreaPercentage: 20,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/dominant-color-area-analyzer",
  title: "Dominant Color Area Percentage Analyzer",
  description:
    "Dominant observed nonoverlapping flag colour areas with ties and unsegmented denominator retained; no segmentation, pixel approximation or dominant unknown-region claim.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dominantObservedColorIds: {
            type: "array",
            items: { type: "string" },
          },
          observedColorAreaPercentages: {
            type: "array",
            items: { type: "number" },
          },
          unknownAreaPercentage: { type: "number" },
        },
        required: [
          "dominantObservedColorIds",
          "observedColorAreaPercentages",
          "unknownAreaPercentage",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
