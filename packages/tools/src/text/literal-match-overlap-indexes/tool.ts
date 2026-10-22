import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, occurrences } from "../batch53-shared.js";

export type Input = Readonly<{ text: string; needle: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "needle", label: "Needle", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  return { offsets: occurrences(i.text, i.needle) };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { text: "aaaa", needle: "aa" },
  output: { result: { offsets: [0, 1, 2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/literal-match-overlap-indexes",
  title: "Overlapping Literal Match Indexes",
  description:
    "Return overlapping literal-match UTF-16 offsets; distinct from a nonoverlapping replacement operation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { offsets: { type: "array", items: { type: "number" } } },
        required: ["offsets"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
