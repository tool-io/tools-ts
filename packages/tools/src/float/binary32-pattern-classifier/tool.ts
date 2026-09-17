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
  const f = H.floatFields(i.pattern, 32);
  return H.finish({ sign: f.sign, classification: f.kind });
};
export const example = {
  input: { pattern: "1065353216" },
  output: { result: { sign: 0, classification: "normal" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "float/binary32-pattern-classifier",
  title: "IEEE Binary32 Pattern Classifier",
  description:
    "Classify every IEEE binary32 raw pattern without numeric conversion as zero/subnormal/normal/infinity/nan, preserving sign.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
