import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ priority: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "priority", label: "priority", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.priority, 0, 191);
  return H.finish({
    facility: Math.floor(i.priority / 8),
    severity: i.priority % 8,
  });
};
export const example = {
  input: { priority: 165 },
  output: { result: { facility: 20, severity: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "log/syslog-priority-component-split",
  title: "Syslog Priority Component Split",
  description:
    "Split a validated syslog priority integer into facility and severity bit-field values.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
