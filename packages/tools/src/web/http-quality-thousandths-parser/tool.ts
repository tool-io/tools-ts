import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch53-shared.js";

export type Input = Readonly<{ value: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "value", label: "Value", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!/^(?:0(?:\.[0-9]{0,3})?|1(?:\.0{0,3})?)$(?![\s\S])/.test(i.value))
    simpleError("quality", "RFC qvalue 0–1 with at most three decimal digits.");
  return { thousandths: Math.round(Number(i.value) * 1000) };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { value: "0.125" },
  output: { result: { thousandths: 125 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "web/http-quality-thousandths-parser",
  title: "HTTP Quality Thousandths Parser",
  description:
    "Parse strict HTTP qvalue syntax into exact integer thousandths; no signs, exponent, whitespace or more than three decimals.",
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
