import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ facility: number; severity: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "facility", label: "facility", kind: "integer" },
  { id: "severity", label: "severity", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.facility, 0, 23);
  H.int(i.severity, 0, 7);
  return H.finish({ priority: i.facility * 8 + i.severity });
};
export const example = {
  input: { facility: 20, severity: 5 },
  output: { result: { priority: 165 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "log/syslog-priority-component-join",
  title: "Syslog Priority Component Join",
  description:
    "Join validated RFC syslog facility 0\u201323 and severity 0\u20137 into the numeric priority, without message serialization.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
