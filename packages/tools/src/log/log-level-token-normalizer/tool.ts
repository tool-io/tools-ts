import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ level: string; aliasesJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "level", label: "level", kind: "string" },
  { id: "aliasesJson", label: "aliasesJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.resolveAlias(H.aliases(i.aliasesJson), i.level);
  return H.finish({ normalized: r.terminal, cycle: r.cycle, path: r.path });
};
export const example = {
  input: { level: "warn", aliasesJson: '[{"name":"warn","target":"warning"}]' },
  output: {
    result: { normalized: "warning", cycle: false, path: ["warn", "warning"] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "log/log-level-token-normalizer",
  title: "Log Level Token Normalizer",
  description:
    "Normalize a log-level token through explicit caller aliases with cycle/path evidence; no universal severity vocabulary.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
