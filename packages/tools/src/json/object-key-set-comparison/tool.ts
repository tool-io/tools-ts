import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, parseJson, record } from "../batch53-shared.js";

export type Input = Readonly<{ leftJson: string; rightJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "leftJson", label: "Left json", kind: "string" },
  { id: "rightJson", label: "Right json", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const a = Object.keys(record(parseJson(i.leftJson))),
    b = Object.keys(record(parseJson(i.rightJson)));
  return {
    onlyLeft: a.filter((k) => !b.includes(k)),
    onlyRight: b.filter((k) => !a.includes(k)),
    shared: a.filter((k) => b.includes(k)),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { leftJson: '{"a":1,"b":2}', rightJson: '{"b":3,"c":4}' },
  output: { result: { onlyLeft: ["a"], onlyRight: ["c"], shared: ["b"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/object-key-set-comparison",
  title: "Object Key Set Comparison",
  description:
    "Compare own key sets of two JSON objects; values and inherited names are not compared.",
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
