import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, unescapePointer } from "../batch53-shared.js";

export type Input = Readonly<{ token: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "token", label: "Token", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  return { unescaped: unescapePointer(i.token) };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { token: "~01~1" },
  output: { result: { unescaped: "~1/" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/pointer-token-unescape-strict",
  title: "Strict JSON Pointer Token Unescaper",
  description:
    "Strictly unescape one RFC 6901 token, rejecting invalid tilde escapes and decoding only once.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { unescaped: { type: "string" } },
        required: ["unescaped"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
