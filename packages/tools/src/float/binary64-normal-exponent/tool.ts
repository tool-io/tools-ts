import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ pattern: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "pattern", label: "pattern", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const f = H.floatFields(i.pattern, 64);
  return H.finish({
    classification: f.kind,
    exponent: f.kind === "normal" ? f.exponent - f.bias : null,
  });
};
export const example = {
  input: { pattern: "4607182418800017408" },
  output: { result: { classification: "normal", exponent: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "float/binary64-normal-exponent",
  title: "IEEE Binary64 Normal Exponent",
  description:
    "Decode unbiased exponent only for an IEEE binary64 normal raw pattern; other classes have null normal exponent, not an inferred finite value.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
