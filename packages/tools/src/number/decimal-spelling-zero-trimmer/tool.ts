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
  let n = d.n,
    s = d.scale;
  while (s > 0 && n % 10n === 0n) {
    n /= 10n;
    s--;
  }
  return H.finish({ decimal: H.decimalText(n, s) });
};
export const example = {
  input: { decimal: "-001.2300" },
  output: { result: { decimal: "-1.23" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "number/decimal-spelling-zero-trimmer",
  title: "Decimal Spelling Zero Trimmer",
  description:
    "Canonicalize a decimal spelling by removing fractional trailing zeros and integer leading zeros; negative zero becomes zero.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
