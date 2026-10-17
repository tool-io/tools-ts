import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ mask: readonly (readonly number[])[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "mask", label: "mask", kind: "matrix" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const c = H.components(i.mask, true);
  return H.finish({
    labels: c.labels,
    components: c.cells.map((cells, j) => ({ label: j + 1, cells })),
  });
};
export const example = {
  input: {
    mask: [
      [1, 0],
      [0, 1],
    ],
  },
  output: {
    result: {
      labels: [
        [1, 0],
        [0, 1],
      ],
      components: [
        {
          label: 1,
          cells: [
            [0, 0],
            [1, 1],
          ],
        },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Binary Mask Eight Connected Component Labels",
      "image morphology",
      "image processing",
    ],
    collections: ["data", "learn"],
    fields: ["morphology", "image morphology", "image processing"],
    keywords: ["image morphology", "image processing"],
  },
  id: "morphology/eight-connected-component-labels",
  title: "Binary Mask Eight Connected Component Labels",
  description:
    "Label eight-connected foreground components of a supplied binary mask using row-major discovery and deterministic flood-fill; zero is background, no object identity inference.",
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
          labels: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
          components: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                label: { type: "number" },
                cells: {
                  type: "array",
                  items: { type: "array", items: { type: "number" } },
                },
              },
              required: ["label", "cells"],
            },
          },
        },
        required: ["labels", "components"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
