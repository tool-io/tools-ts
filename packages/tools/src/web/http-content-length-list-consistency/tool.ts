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
  const a = i.value
      .split(",")
      .map((v) => decimalUnsigned(v.replace(/^[ \t]+|[ \t]+$/g, ""))),
    same = a.every((v) => v === a[0]);
  return {
    consistent: same,
    canonicalDecimal: same ? a[0] : null,
    memberCount: a.length,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { value: "42, 042" },
  output: {
    result: { consistent: true, canonicalDecimal: "42", memberCount: 2 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "web/http-content-length-list-consistency",
  title: "HTTP Content Length List Consistency",
  description:
    "Audit comma-combined Content-Length decimal members for exact numeric consistency after OWS trimming; does not accept empty members.",
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
