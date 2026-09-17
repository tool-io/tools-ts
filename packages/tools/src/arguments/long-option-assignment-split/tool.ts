import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ argument: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "argument", label: "argument", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const m = /^--([A-Za-z0-9][A-Za-z0-9-]*)(?:=([\s\S]*))?(?![\s\S])/.exec(
    i.argument,
  );
  H.check(m);
  return H.finish({
    name: m![1],
    assigned: m![2] !== undefined,
    value: m![2] ?? null,
  });
};
export const example = {
  input: { argument: "--name=a=b" },
  output: { result: { name: "name", assigned: true, value: "a=b" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "arguments/long-option-assignment-split",
  title: "Long Option Assignment Splitter",
  description:
    "Split one strict ASCII --long-name[=value] argv token at the first equals; no shell parsing or implicit next-token consumption.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
