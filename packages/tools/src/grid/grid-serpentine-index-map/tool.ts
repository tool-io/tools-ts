import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch53-shared.js";

export type Input = Readonly<{ rows: number; columns: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "rows", label: "Rows", kind: "number" },
  { id: "columns", label: "Columns", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  bounded(i.rows, "rows", 1, 128);
  bounded(i.columns, "columns", 1, 128);
  return {
    sourceIndexes: Array.from({ length: i.rows * i.columns }, (_, j) => {
      const r = Math.floor(j / i.columns),
        c = j % i.columns;
      return r * i.columns + (r % 2 ? i.columns - 1 - c : c);
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { rows: 2, columns: 3 },
  output: { result: { sourceIndexes: [0, 1, 2, 5, 4, 3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "grid/grid-serpentine-index-map",
  title: "Grid Serpentine Index Map",
  description:
    "Map serpentine traversal positions to row-major source indexes, reversing odd rows while retaining the first row direction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourceIndexes: { type: "array", items: { type: "number" } },
        },
        required: ["sourceIndexes"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
