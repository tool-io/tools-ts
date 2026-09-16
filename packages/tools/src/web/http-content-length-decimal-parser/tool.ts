import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, decimalUnsigned } from "../batch53-shared.js";

export type Input = Readonly<{ value: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "value", label: "Value", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return { canonicalDecimal: decimalUnsigned(i.value) };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { value: "00042" },
  output: { result: { canonicalDecimal: "42" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "web/http-content-length-decimal-parser",
  title: "HTTP Content Length Decimal Parser",
  description:
    "Parse Content-Length as exact unsigned ASCII decimal text without unsafe numeric conversion, signs, whitespace or exponent syntax.",
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
