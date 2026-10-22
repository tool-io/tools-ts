import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, lines } from "../batch53-shared.js";

export type Input = Readonly<{ text: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "text", label: "Text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  const a = lines(i.text);
  const keep = a.filter((r, j) => j === 0 || r.text !== a[j - 1].text);
  return {
    text: keep.map((r) => r.text + r.eol).join(""),
    removedLineCount: a.length - keep.length,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { text: "a\na\nb" },
  output: { result: { text: "a\nb", removedLineCount: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/consecutive-duplicate-line-collapser",
  title: "Consecutive Duplicate Line Collapser",
  description:
    "Collapse only consecutive identical line contents, retaining each kept line separator; nonadjacent duplicates remain.",
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
          text: { type: "string" },
          removedLineCount: { type: "number" },
        },
        required: ["text", "removedLineCount"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
