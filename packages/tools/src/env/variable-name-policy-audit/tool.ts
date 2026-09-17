import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ names: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "names", label: "names", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    violations: i.names.flatMap((name, index) =>
      /^[A-Za-z_][A-Za-z0-9_]*(?![\s\S])/.test(name) ? [] : [{ index, name }],
    ),
  });
};
export const example = {
  input: { names: ["GOOD", "2BAD", "a-b"] },
  output: {
    result: {
      violations: [
        { index: 1, name: "2BAD" },
        { index: 2, name: "a-b" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "env/variable-name-policy-audit",
  title: "Environment Variable Name Policy Audit",
  description:
    "Audit explicit environment names under the portable ASCII shell-style identifier policy; not an OS-wide variable-name validity rule.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
