import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly fontPx: number;
  readonly columns: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "fontPx", label: "Font px", kind: "number" },
  { id: "columns", label: "Columns", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.fontPx, "font");
  bounded(i.columns, "columns", 0, 1000000);
  return { approximateWidthPx: i.fontPx * 0.5 * i.columns };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { fontPx: 16, columns: 80 },
  output: { result: { approximateWidthPx: 640 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/monospace-cell-width-half-em",
  title: "Monospace Cell Half-Em Width Rule",
  description:
    "Half-em monospace approximation for caller known compatible metrics; actual glyph advances may differ.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
