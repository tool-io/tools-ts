import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ onsets: readonly number[]; steps: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "onsets", kind: "numberList", label: "onsets" },
  { id: "steps", kind: "integer", label: "steps" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.steps, 0, 128);
  i.onsets.forEach((x) => H.int(x, 0, i.steps - 1));
  const set = new Set(i.onsets);
  return H.finish({
    bits: Array.from({ length: i.steps }, (_, j) =>
      set.has(j) ? "1" : "0",
    ).join(""),
  });
};
export const example = {
  input: { onsets: [0, 2, 2], steps: 4 },
  output: { result: { bits: "1010" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/rhythm-grid-binary-encoder",
  title: "Rhythm Grid Binary Encoder",
  description:
    "Encode bounded rhythm onset positions as a step mask, explicitly coalescing repeated onsets.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
