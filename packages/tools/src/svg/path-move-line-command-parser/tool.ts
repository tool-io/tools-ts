import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, moveLineParse } from "../batch53-shared.js";

export type Input = Readonly<{ pathData: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "pathData", label: "Path data", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return { commands: moveLineParse(i.pathData) };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { pathData: "M0 0 1 2 l3 4" },
  output: {
    result: {
      commands: [
        { command: "M", x: 0, y: 0 },
        { command: "L", x: 1, y: 2 },
        { command: "l", x: 3, y: 4 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "svg/path-move-line-command-parser",
  title: "SVG Move Line Command Parser",
  description:
    "Parse the bounded SVG M/m/L/l number-pair branch with implicit lineto after moveto; reject curves, closepath and incomplete commands.",
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
