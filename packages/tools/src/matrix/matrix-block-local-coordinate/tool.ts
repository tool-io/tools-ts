import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  row: number;
  column: number;
  blockRowStart: number;
  blockColumnStart: number;
  blockRows: number;
  blockColumns: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "row", label: "Row", kind: "integer" },
  { id: "column", label: "Column", kind: "integer" },
  { id: "blockRowStart", label: "Block row start", kind: "integer" },
  { id: "blockColumnStart", label: "Block column start", kind: "integer" },
  { id: "blockRows", label: "Block rows", kind: "integer" },
  { id: "blockColumns", label: "Block columns", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  [i.row, i.column, i.blockRowStart, i.blockColumnStart].forEach((x) =>
    H.int(x, 0, 1000000000),
  );
  H.int(i.blockRows, 0, 1000000);
  H.int(i.blockColumns, 0, 1000000);
  const inside =
    i.row >= i.blockRowStart &&
    i.row < i.blockRowStart + i.blockRows &&
    i.column >= i.blockColumnStart &&
    i.column < i.blockColumnStart + i.blockColumns;
  return H.finish({
    inside,
    localRow: inside ? i.row - i.blockRowStart : -1,
    localColumn: inside ? i.column - i.blockColumnStart : -1,
  });
};
export const example = {
  input: {
    row: 4,
    column: 6,
    blockRowStart: 3,
    blockColumnStart: 4,
    blockRows: 2,
    blockColumns: 3,
  },
  output: { result: { inside: true, localRow: 1, localColumn: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "matrix/matrix-block-local-coordinate",
  title: "Matrix: Matrix Block Local Coordinate Tool",
  description:
    "Resolve one matrix coordinate relative to an explicit half-open block, returning -1 local coordinates when outside rather than clamping.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          inside: { type: "boolean" },
          localColumn: { type: "number" },
          localRow: { type: "number" },
        },
        required: ["inside", "localColumn", "localRow"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
