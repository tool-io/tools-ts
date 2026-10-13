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
    support: i.labels.map((label, j) => ({
      label,
      value: i.matrix.reduce((s, r) => s + r[j], 0),
    })),
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
      support: [
        { label: "a", value: 2 },
        { label: "b", value: 2 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Confusion Predicted Support Table",
      "machine learning",
      "classification metrics",
    ],
    collections: ["ai", "data"],
    fields: ["classification", "machine learning", "classification metrics"],
    keywords: ["machine learning", "classification metrics"],
  },
  id: "classification/confusion-predicted-support-table",
  title: "Confusion Predicted Support Table",
  description:
    "Explicit nonnegative square confusion table with unique supplied labels, actual rows and predicted columns; report predicted column support totals without calculating per-class rates.",
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
          support: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                label: { type: "string" },
                value: { type: "number" },
              },
              required: ["label", "value"],
            },
          },
        },
        required: ["support"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
