import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  decimal: string;
  integerTrailingZerosSignificant: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "decimal", kind: "string", label: "decimal" },
  {
    id: "integerTrailingZerosSignificant",
    kind: "boolean",
    label: "integerTrailingZerosSignificant",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const d = H.decimal(i.decimal);
  const m = /^[+-]?(\d+)(?:\.(\d*))?/.exec(i.decimal)!;
  let digits = (m[1] + (m[2] ?? "")).replace(/^0+/, "");
  if (m[2] === undefined && !i.integerTrailingZerosSignificant)
    digits = digits.replace(/0+$/, "");
  return H.finish({ significantDigits: digits.length || 1, zero: d.n === 0n });
};
export const example = {
  input: { decimal: "0.001200", integerTrailingZerosSignificant: false },
  output: { result: { significantDigits: 4, zero: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "number/decimal-significant-digit-count",
  title: "Decimal Significant Digit Count",
  description:
    "Count spelling-defined significant digits with an explicit integer-trailing-zero policy; decimal trailing zeros count and all-zero text counts as one.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
