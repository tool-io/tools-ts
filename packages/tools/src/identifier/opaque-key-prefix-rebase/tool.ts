import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  keys: readonly string[];
  oldPrefix: string;
  newPrefix: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "keys", label: "keys", kind: "stringList" },
  { id: "oldPrefix", label: "oldPrefix", kind: "string" },
  { id: "newPrefix", label: "newPrefix", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.oldPrefix.length > 0);
  return H.finish({
    keys: i.keys.map((key) => {
      H.check(key.startsWith(i.oldPrefix));
      return i.newPrefix + key.slice(i.oldPrefix.length);
    }),
  });
};
export const example = {
  input: { keys: ["old/a", "old/b"], oldPrefix: "old/", newPrefix: "new/" },
  output: { result: { keys: ["new/a", "new/b"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "identifier/opaque-key-prefix-rebase",
  title: "Opaque Key Prefix Rebase",
  description:
    "Rebase literal opaque key prefixes only when every supplied key matches the explicit old prefix; no path normalization, substring replacement or inferred aliases.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
