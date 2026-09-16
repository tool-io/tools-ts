import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, httpToken } from "../batch53-shared.js";

export type Input = Readonly<{ value: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "value", label: "Value", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    valid: httpToken.test(i.value),
    invalidOffsets: [...i.value].flatMap((c, j) =>
      httpToken.test(c) ? [] : [j],
    ),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { value: "bad name" },
  output: { result: { valid: false, invalidOffsets: [3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "web/http-token-character-audit",
  title: "HTTP Token Character Audit",
  description:
    "Audit HTTP token characters and zero-based Unicode scalar positions; an empty token is invalid even with no offending character.",
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
