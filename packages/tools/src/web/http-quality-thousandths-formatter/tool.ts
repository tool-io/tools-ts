import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch53-shared.js";

export type Input = Readonly<{ thousandths: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "thousandths", label: "Thousandths", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(i.thousandths, "q", 0, 1000);
  return {
    value:
      i.thousandths === 1000
        ? "1"
        : i.thousandths === 0
          ? "0"
          : "0." + String(i.thousandths).padStart(3, "0").replace(/0+$/, ""),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { thousandths: 125 },
  output: { result: { value: "0.125" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "web/http-quality-thousandths-formatter",
  title: "HTTP Quality Thousandths Formatter",
  description:
    "Format integer quality thousandths as a minimal RFC qvalue spelling between zero and one.",
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
