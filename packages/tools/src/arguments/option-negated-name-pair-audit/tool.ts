import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  present: readonly string[];
  names: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "present", label: "present", kind: "stringList" },
  { id: "names", label: "names", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    conflicts: i.names.filter(
      (name) => i.present.includes(name) && i.present.includes("no-" + name),
    ),
  });
};
export const example = {
  input: { present: ["color", "no-color"], names: ["color", "quiet"] },
  output: { result: { conflicts: ["color"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "arguments/option-negated-name-pair-audit",
  title: "Option Negated Name Pair Audit",
  description:
    "Audit explicit positive/no-name option pairs for simultaneous presence under a caller-listed negatable option bank; no boolean value interpretation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
