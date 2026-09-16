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
  const sign = d.n < 0n ? "-" : "",
    digits = String(H.abs(d.n));
  const exponent = digits.length - d.scale - 1;
  const tail = digits.slice(1).replace(/0+$/, "");
  return H.finish({
    scientific:
      d.n === 0n
        ? "0e0"
        : sign + digits[0] + (tail ? "." + tail : "") + "e" + exponent,
  });
};
export const example = {
  input: { decimal: "0.0012300" },
  output: { result: { scientific: "1.23e-3" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "number/decimal-spelling-exponent-compactor",
  title: "Decimal Exponent Spelling Compactor",
  description:
    "Compact an exact finite decimal spelling into canonical scientific notation without numeric parsing.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
