import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ steps: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "steps", kind: "numberList", label: "steps" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  i.steps.forEach((x) => H.int(x, 0, 127));
  return H.finish({ collisions: H.duplicates(i.steps, String) });
};
export const example = {
  input: { steps: [2, 1, 2] },
  output: { result: { collisions: [{ key: "2", indexes: [0, 2] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/rhythm-step-collision-table",
  title: "Rhythm Step Collision Table",
  description:
    "Audit simultaneous rhythm step collisions while retaining original event indexes instead of deduplicating.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
