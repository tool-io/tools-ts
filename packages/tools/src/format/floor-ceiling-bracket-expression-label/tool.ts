import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ expression: string; operation: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "expression", label: "Expression", kind: "string" },
  {
    id: "operation",
    label: "Operation",
    kind: "string",
    enum: ["floor", "ceiling"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.choice(i.operation, ["floor", "ceiling"]);
  H.check(i.expression.length > 0 && !/[\r\n]/.test(i.expression));
  return H.finish({
    label:
      i.operation === "floor"
        ? "⌊" + i.expression + "⌋"
        : "⌈" + i.expression + "⌉",
  });
};
export const example = {
  input: { expression: "x/2", operation: "floor" },
  output: { result: { label: "\u230ax/2\u230b" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "format/floor-ceiling-bracket-expression-label",
  title: "Formatting: Floor Ceiling Bracket Expression Label Tool",
  description:
    "Wrap an explicitly opaque one-line expression in floor or ceiling notation without parsing or evaluating it.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string" } },
        required: ["label"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
