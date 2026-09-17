import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ names: readonly string[]; aliasesJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "names", label: "names", kind: "stringList" },
  { id: "aliasesJson", label: "aliasesJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const m = H.aliases(i.aliasesJson);
  return H.finish({
    names: i.names.map((name) => ({ input: name, ...H.resolveAlias(m, name) })),
  });
};
export const example = {
  input: { names: ["v"], aliasesJson: '[{"name":"v","target":"verbose"}]' },
  output: {
    result: {
      names: [
        {
          input: "v",
          path: ["v", "verbose"],
          terminal: "verbose",
          cycle: false,
        },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "arguments/option-alias-canonicalizer",
  title: "Option Alias Canonicalizer",
  description:
    "Canonicalize supplied option names through explicit aliases, retaining each chain and cycle evidence; no argv parsing or unknown option rejection.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
