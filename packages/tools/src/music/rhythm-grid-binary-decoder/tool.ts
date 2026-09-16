import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ bits: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bits", kind: "string", label: "bits" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bits(i.bits);
  return H.finish({
    steps: i.bits.length,
    onsets: i.bits.split("").flatMap((x, j) => (x === "1" ? [j] : [])),
  });
};
export const example = {
  input: { bits: "1010" },
  output: { result: { steps: 4, onsets: [0, 2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/rhythm-grid-binary-decoder",
  title: "Rhythm Grid Binary Decoder",
  description:
    "Decode a binary rhythm step mask into onset indexes and explicit grid size.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
