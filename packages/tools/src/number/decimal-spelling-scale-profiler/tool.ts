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
  return H.finish({
    coefficient: String(d.n),
    scale: d.scale,
    negativeZero: d.negativeZero,
  });
};
export const example = {
  input: { decimal: "-001.2300" },
  output: { result: { coefficient: "-12300", scale: 4, negativeZero: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "number/decimal-spelling-scale-profiler",
  title: "Decimal Spelling Scale Profiler",
  description:
    "Profile exact decimal spelling as integer coefficient and decimal scale, including exponent and negative-zero evidence.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
