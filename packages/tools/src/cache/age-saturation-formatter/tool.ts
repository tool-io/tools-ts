import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ age: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "age", label: "age", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const age = H.bigint(i.age),
    limit = 2147483648n;
  H.check(age >= 0n);
  return H.finish({
    value: String(age > limit ? limit : age),
    saturated: age > limit,
  });
};
export const example = {
  input: { age: "9007199254740993" },
  output: { result: { value: "2147483648", saturated: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cache/age-saturation-formatter",
  title: "Cache Age Saturation Formatter",
  description:
    "Format a nonnegative exact cache Age integer with RFC delta-seconds overflow saturation at 2^31; does not read response timing.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
