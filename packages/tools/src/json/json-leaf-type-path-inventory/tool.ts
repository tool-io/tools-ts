import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  parseJson,
  typeOf,
  jsonLeaves,
} from "../batch53-shared.js";

export type Input = Readonly<{ documentJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "documentJson", label: "Document json", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    leaves: jsonLeaves(parseJson(i.documentJson)).map((v) => ({
      path: v.path,
      type: typeOf(v.value),
    })),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { documentJson: '{"a":[1,null]}' },
  output: {
    result: {
      leaves: [
        { path: "/a/0", type: "number" },
        { path: "/a/1", type: "null" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/json-leaf-type-path-inventory",
  title: "JSON Leaf Type Path Inventory",
  description:
    "Inventory JSON scalar leaves with escaped RFC 6901 paths; empty containers have no scalar leaf and are not misclassified as values.",
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
