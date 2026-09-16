import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, filename } from "../batch53-shared.js";

export type Input = Readonly<{
  name: string;
  removePrefix: string;
  removeSuffix: string;
  addPrefix: string;
  addSuffix: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "name", label: "Name", kind: "string" },
  { id: "removePrefix", label: "Remove prefix", kind: "string" },
  { id: "removeSuffix", label: "Remove suffix", kind: "string" },
  { id: "addPrefix", label: "Add prefix", kind: "string" },
  { id: "addSuffix", label: "Add suffix", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  filename(i.name);
  let name = i.name;
  if (i.removePrefix && name.startsWith(i.removePrefix))
    name = name.slice(i.removePrefix.length);
  if (i.removeSuffix && name.endsWith(i.removeSuffix))
    name = name.slice(0, name.length - i.removeSuffix.length);
  name = i.addPrefix + name + i.addSuffix;
  filename(name);
  return { name };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    name: "old-a.txt",
    removePrefix: "old-",
    removeSuffix: ".txt",
    addPrefix: "new-",
    addSuffix: ".md",
  },
  output: { result: { name: "new-a.md" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "path/filename-literal-affix-renamer",
  title: "Filename Literal Affix Renamer",
  description:
    "Plan literal filename affix replacement in a defined prefix-then-suffix order; no glob/regex or filesystem rename occurs.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
