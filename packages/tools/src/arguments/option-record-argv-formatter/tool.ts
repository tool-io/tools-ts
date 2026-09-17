import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  optionsJson: string;
  positionals: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "optionsJson", label: "optionsJson", kind: "string" },
  { id: "positionals", label: "positionals", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.records(i.optionsJson).map((v) => {
    const name = H.str(v.name);
    H.check(/^[A-Za-z0-9][A-Za-z0-9-]*(?![\s\S])/.test(name));
    H.check(v.value === null || typeof v.value === "string");
    return { name, value: v.value as string | null };
  });
  return H.finish({
    arguments: [
      ...r.map((v) => "--" + v.name + (v.value === null ? "" : "=" + v.value)),
      ...(i.positionals.length ? ["--", ...i.positionals] : []),
    ],
  });
};
export const example = {
  input: {
    optionsJson: '[{"name":"x","value":"a b"},{"name":"quiet","value":null}]',
    positionals: ["-file"],
  },
  output: { result: { arguments: ["--x=a b", "--quiet", "--", "-file"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "arguments/option-record-argv-formatter",
  title: "Option Record Argument Vector Formatter",
  description:
    "Format explicit option records and positional tokens into a literal argv vector using attached values and an end marker; not a shell command string.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
