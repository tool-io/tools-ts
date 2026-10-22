import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  tripletsJson: string;
  rows: number;
  columns: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "tripletsJson", label: "tripletsJson", kind: "string" },
  { id: "rows", label: "rows", kind: "integer" },
  { id: "columns", label: "columns", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.triplets(i.tripletsJson, i.rows, i.columns);
  return H.finish({
    rows: i.columns,
    columns: i.rows,
    triplets: r.map((v) => ({ ...v, row: v.column, column: v.row })),
  });
};
export const example = {
  input: {
    tripletsJson:
      '[{"row":0,"column":1,"value":2},{"row":0,"column":1,"value":3},{"row":1,"column":0,"value":0}]',
    rows: 2,
    columns: 2,
  },
  output: {
    result: {
      rows: 2,
      columns: 2,
      triplets: [
        { row: 1, column: 0, value: 2 },
        { row: 1, column: 0, value: 3 },
        { row: 0, column: 1, value: 0 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Sparse Coordinate Triplet Transpose",
      "sparse matrices",
      "linear algebra",
    ],
    collections: ["data", "learn"],
    fields: ["sparse", "sparse matrices", "linear algebra"],
    keywords: ["sparse matrices", "linear algebra"],
  },
  id: "sparse/coordinate-triplet-transpose",
  title: "Sparse Coordinate Triplet Transpose",
  description:
    "Transpose COO coordinate records and swap matrix dimensions without sorting, combining duplicates or dropping explicit zeros.",
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
          rows: { type: "number" },
          columns: { type: "number" },
          triplets: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                value: { type: "number" },
                row: { type: "number" },
                column: { type: "number" },
              },
              required: ["value", "row", "column"],
            },
          },
        },
        required: ["rows", "columns", "triplets"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
