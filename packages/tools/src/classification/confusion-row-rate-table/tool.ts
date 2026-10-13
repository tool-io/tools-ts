import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  matrix: readonly (readonly number[])[];
  labels: readonly string[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "matrix", label: "matrix", kind: "matrix" },
  { id: "labels", label: "labels", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.confusion(i.matrix, i.labels);
  return H.finish({
    rates: i.matrix.map((row) => {
      const total = row.reduce((s, x) => s + x, 0);
      return row.map((x) => (total ? x / total : null));
    }),
  });
};
export const example = {
  input: {
    matrix: [
      [2, 1],
      [0, 1],
    ],
    labels: ["a", "b"],
  },
  output: {
    result: {
      rates: [
        [0.6666666666666666, 0.3333333333333333],
        [0, 1],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Confusion Row Rate Table",
      "machine learning",
      "classification metrics",
    ],
    collections: ["ai", "data"],
    fields: ["classification", "machine learning", "classification metrics"],
    keywords: ["machine learning", "classification metrics"],
  },
  id: "classification/confusion-row-rate-table",
  title: "Confusion Row Rate Table",
  description:
    "Explicit nonnegative square confusion table with unique supplied labels, actual rows and predicted columns; normalize each actual row independently with null for all cells of zero-support rows; undefined evidence is not converted to zero.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          rates: {
            type: "array",
            items: {
              type: "array",
              items: { anyOf: [{ type: "number" }, { type: "null" }] },
            },
          },
        },
        required: ["rates"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
