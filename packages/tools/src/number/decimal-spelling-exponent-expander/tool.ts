import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ decimal: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "decimal", kind: "string", label: "decimal" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const d = H.decimal(i.decimal);
  return H.finish({ decimal: H.decimalText(d.n, d.scale) });
};
export const example = {
  input: { decimal: "1.23e-3" },
  output: { result: { decimal: "0.00123" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "number/decimal-spelling-exponent-expander",
  title: "Decimal Exponent Spelling Expander",
  description:
    "Expand finite decimal exponent notation exactly to plain text with the explicit source scale retained.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
