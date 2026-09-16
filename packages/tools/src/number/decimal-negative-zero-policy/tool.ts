import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ decimal: string; preserve: boolean }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "decimal", kind: "string", label: "decimal" },
  { id: "preserve", kind: "boolean", label: "preserve" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const d = H.decimal(i.decimal);
  return H.finish({
    decimal:
      d.negativeZero && i.preserve
        ? "-" + H.decimalText(0n, d.scale)
        : H.decimalText(d.n, d.scale),
    wasNegativeZero: d.negativeZero,
  });
};
export const example = {
  input: { decimal: "-0.00", preserve: true },
  output: { result: { decimal: "-0.00", wasNegativeZero: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "number/decimal-negative-zero-policy",
  title: "Decimal Negative Zero Policy",
  description:
    "Apply an explicit negative-zero spelling policy without treating negative zero as a different numerical value.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
