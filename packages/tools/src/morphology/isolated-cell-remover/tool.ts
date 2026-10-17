import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  mask: readonly (readonly number[])[];
  eight: boolean;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "mask", label: "mask", kind: "matrix" },
  { id: "eight", label: "eight", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const c = H.components(i.mask, i.eight);
  return H.finish({
    mask: c.labels.map((row) =>
      row.map((x) => Number(x > 0 && c.cells[x - 1].length > 1)),
    ),
  });
};
export const example = {
  input: {
    mask: [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ],
    eight: false,
  },
  output: {
    result: {
      mask: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Binary Mask Isolated Cell Remover",
      "image morphology",
      "image processing",
    ],
    collections: ["data", "learn"],
    fields: ["morphology", "image morphology", "image processing"],
    keywords: ["image morphology", "image processing"],
  },
  id: "morphology/isolated-cell-remover",
  title: "Binary Mask Isolated Cell Remover",
  description:
    "Remove only isolated one-cell foreground connected components under caller four/eight adjacency; larger components remain unchanged.",
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
          mask: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
        },
        required: ["mask"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
