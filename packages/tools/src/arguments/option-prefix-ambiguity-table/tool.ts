import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  prefixes: readonly string[];
  options: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "prefixes", label: "prefixes", kind: "stringList" },
  { id: "options", label: "options", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    H.unique(i.options).length === i.options.length &&
      i.prefixes.every((x) => x.length > 0),
  );
  return H.finish({
    matches: i.prefixes.map((prefix) => ({
      prefix,
      options: i.options.filter((x) => x.startsWith(prefix)),
      ambiguous: i.options.filter((x) => x.startsWith(prefix)).length > 1,
    })),
  });
};
export const example = {
  input: { prefixes: ["ver", "v"], options: ["version", "verbose", "quiet"] },
  output: {
    result: {
      matches: [
        { prefix: "ver", options: ["version", "verbose"], ambiguous: true },
        { prefix: "v", options: ["version", "verbose"], ambiguous: true },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "arguments/option-prefix-ambiguity-table",
  title: "Option Prefix Ambiguity Table",
  description:
    "Inventory exact long-option prefix candidates and ambiguities under an explicit option-name bank; no abbreviation acceptance policy.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
