import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  pointerTokens,
  pointerFormat,
} from "../batch53-shared.js";

export type Input = Readonly<{ pointer: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "pointer", label: "Pointer", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  const a = pointerTokens(i.pointer);
  return {
    hasParent: a.length > 0,
    parent: a.length ? pointerFormat(a.slice(0, -1)) : null,
    finalToken: a.length ? a[a.length - 1] : null,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { pointer: "/a/b" },
  output: { result: { hasParent: true, parent: "/a", finalToken: "b" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/pointer-parent-and-final-token",
  title: "JSON Pointer Parent and Final Token",
  description:
    "Split an RFC 6901 pointer into parent pointer and decoded final token; root has no parent or final token.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          hasParent: { type: "boolean" },
          parent: { anyOf: [{ type: "string" }, { type: "null" }] },
          finalToken: { anyOf: [{ type: "string" }, { type: "null" }] },
        },
        required: ["hasParent", "parent", "finalToken"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
