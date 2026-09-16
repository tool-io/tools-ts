import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ aliasesJson: string; name: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "aliasesJson", kind: "string", label: "aliasesJson" },
  { id: "name", kind: "string", label: "name" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish(H.resolveAlias(H.aliases(i.aliasesJson), i.name));
};
export const example = {
  input: {
    aliasesJson: '[{"name":"a","target":"b"},{"name":"b","target":"c"}]',
    name: "a",
  },
  output: { result: { path: ["a", "b", "c"], terminal: "c", cycle: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "palette/palette-role-alias-resolver",
  title: "Palette Role Alias Resolver",
  description:
    "Resolve an explicit palette role alias chain with path provenance and cycle evidence; an unmapped name is a terminal literal, not a verified palette entry.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
