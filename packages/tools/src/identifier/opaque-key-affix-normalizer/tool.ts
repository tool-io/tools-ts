import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  keys: readonly string[];
  prefix: string;
  suffix: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "keys", label: "keys", kind: "stringList" },
  { id: "prefix", label: "prefix", kind: "string" },
  { id: "suffix", label: "suffix", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    keys: i.keys.map((key) => {
      let s = key;
      if (i.prefix && s.startsWith(i.prefix)) s = s.slice(i.prefix.length);
      if (i.suffix && s.endsWith(i.suffix)) s = s.slice(0, -i.suffix.length);
      return i.prefix + s + i.suffix;
    }),
  });
};
export const example = {
  input: { keys: ["a", "pre-a-end"], prefix: "pre-", suffix: "-end" },
  output: { result: { keys: ["pre-a-end", "pre-a-end"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "identifier/opaque-key-affix-normalizer",
  title: "Opaque Key Affix Normalizer",
  description:
    "Ensure caller prefix and suffix are present after stripping/reapplying at most one matching affix; repeated inner affixes remain literal data, no recursive stripping or path semantics.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
