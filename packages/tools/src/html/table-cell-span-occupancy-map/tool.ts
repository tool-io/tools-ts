import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  cellsJson: string;
  rows: number;
  columns: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "cellsJson", kind: "string", label: "cellsJson" },
  { id: "rows", kind: "integer", label: "rows" },
  { id: "columns", kind: "integer", label: "columns" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.rows, 0, 128);
  H.int(i.columns, 0, 128);
  const r = H.records(i.cellsJson).map((v) => ({
    row: H.int(H.num(v.row), 0, i.rows - 1),
    column: H.int(H.num(v.column), 0, i.columns - 1),
    rowspan: H.int(H.num(v.rowspan), 0, 65534),
    colspan: H.int(H.num(v.colspan), 1, 1000),
  }));
  const occupancy = Array.from({ length: i.rows }, () =>
    Array.from({ length: i.columns }, () => [] as number[]),
  );
  r.forEach((v, j) => {
    const end = v.rowspan === 0 ? i.rows : v.row + v.rowspan;
    H.check(end <= i.rows && v.column + v.colspan <= i.columns);
    for (let a = v.row; a < end; a++)
      for (let b = v.column; b < v.column + v.colspan; b++)
        occupancy[a][b].push(j);
  });
  return H.finish({
    occupancy,
    overlaps: occupancy.flatMap((row, a) =>
      row.flatMap((owners, b) =>
        owners.length > 1 ? [{ row: a, column: b, owners }] : [],
      ),
    ),
  });
};
export const example = {
  input: {
    cellsJson:
      '[{"row":0,"column":0,"rowspan":0,"colspan":1},{"row":1,"column":0,"rowspan":1,"colspan":2}]',
    rows: 2,
    columns: 2,
  },
  output: {
    result: {
      occupancy: [
        [[0], []],
        [[0, 1], [1]],
      ],
      overlaps: [{ row: 1, column: 0, owners: [0, 1] }],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "html/table-cell-span-occupancy-map",
  title: "HTML Table Cell Span Occupancy Map",
  description:
    "Build an occurrence-preserving HTML cell-span owner map at explicitly supplied source coordinates for one row group; rowspan zero reaches that group\u2019s end, no automatic browser table placement.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          occupancy: {
            type: "array",
            items: {
              type: "array",
              items: { type: "array", items: { type: "number" } },
            },
          },
          overlaps: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                row: { type: "number" },
                column: { type: "number" },
                owners: { type: "array", items: { type: "number" } },
              },
              required: ["row", "column", "owners"],
            },
          },
        },
        required: ["occupancy", "overlaps"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
