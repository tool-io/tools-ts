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
  return H.finish({
    pattern: String(H.floatFields(i.pattern, 32).bits ^ (1n << 31n)),
  });
};
export const example = {
  input: { pattern: "1065353216" },
  output: { result: { pattern: "3212836864" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "float/binary32-sign-toggle-pattern",
  title: "IEEE Binary32 Sign Toggle Pattern",
  description:
    "Toggle only the sign bit of an IEEE binary32 raw pattern, including zeros, infinities and NaNs without altering payload bits.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
