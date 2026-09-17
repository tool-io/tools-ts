import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ token: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "token", label: "token", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(/^-[A-Za-z]{1,128}(?![\s\S])/.test(i.token));
  return H.finish({
    flags: i.token
      .slice(1)
      .split("")
      .map((s) => "-" + s),
  });
};
export const example = {
  input: { token: "-abc" },
  output: { result: { flags: ["-a", "-b", "-c"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "arguments/short-flag-cluster-expander",
  title: "Short Flag Cluster Expander",
  description:
    "Expand a caller-declared all-flag ASCII short-option cluster; does not infer which flags take values.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
