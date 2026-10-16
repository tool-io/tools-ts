import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch53-shared.js";

export type Input = Readonly<{ rows: number; columns: number; layer: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "rows", label: "Rows", kind: "number" },
  { id: "columns", label: "Columns", kind: "number" },
  { id: "layer", label: "Layer", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  bounded(i.rows, "rows", 1, 128);
  bounded(i.columns, "columns", 1, 128);
  bounded(i.layer, "layer", 0, 127);
  const indexes: number[] = [];
  for (let r = 0; r < i.rows; r++)
    for (let c = 0; c < i.columns; c++)
      if (Math.min(r, c, i.rows - 1 - r, i.columns - 1 - c) === i.layer)
        indexes.push(r * i.columns + c);
  return { indexes };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { rows: 3, columns: 3, layer: 0 },
  output: { result: { indexes: [0, 1, 2, 3, 5, 6, 7, 8] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "grid/grid-border-ring-indexes",
  title: "Grid Border Ring Indexes",
  description:
    "List row-major cell indexes in an exact inward border ring; out-of-grid layers produce no cells.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { indexes: { type: "array", items: { type: "number" } } },
        required: ["indexes"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
