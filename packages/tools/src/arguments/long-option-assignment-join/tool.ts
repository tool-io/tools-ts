import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  name: string;
  value: string;
  assigned: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "name", label: "name", kind: "string" },
  { id: "value", label: "value", kind: "string" },
  { id: "assigned", label: "assigned", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(/^[A-Za-z0-9][A-Za-z0-9-]*(?![\s\S])/.test(i.name));
  return H.finish({
    argument: "--" + i.name + (i.assigned ? "=" + i.value : ""),
  });
};
export const example = {
  input: { name: "name", value: "a=b", assigned: true },
  output: { result: { argument: "--name=a=b" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "arguments/long-option-assignment-join",
  title: "Long Option Assignment Joiner",
  description:
    "Format one literal long-option argv token under a restricted ASCII option-name grammar; returns one argument, not shell quoting.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
