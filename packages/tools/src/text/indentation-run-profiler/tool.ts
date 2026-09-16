import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, lines } from "../batch53-shared.js";

export type Input = Readonly<{ text: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    lines: lines(i.text).map((r, j) => {
      const prefix = r.text.match(/^[ \t]*/)![0];
      return {
        line: j + 1,
        prefix,
        spaces: [...prefix].filter((c) => c === " ").length,
        tabs: [...prefix].filter((c) => c === "\t").length,
      };
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { text: " a\n\tb" },
  output: {
    result: {
      lines: [
        { line: 1, prefix: " ", spaces: 1, tabs: 0 },
        { line: 2, prefix: "\t", spaces: 0, tabs: 1 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/indentation-run-profiler",
  title: "Indentation Run Profiler",
  description:
    "Profile literal indentation per logical line; counts tabs separately rather than infer visual indentation width.",
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
