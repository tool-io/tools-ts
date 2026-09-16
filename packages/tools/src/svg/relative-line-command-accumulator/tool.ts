import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, moveLineParse } from "../batch53-shared.js";
export type Input = Readonly<{ pathData: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "pathData", label: "Move/line path data", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  let x = 0,
    y = 0;
  const commands = moveLineParse(i.pathData).map((r) => {
    const relative = r.command === r.command.toLowerCase();
    x = relative ? x + r.x : r.x;
    y = relative ? y + r.y : r.y;
    return { command: r.command.toUpperCase(), x, y };
  });
  return finish({ result: { absoluteCommands: commands } });
};
export const example = {
  input: { pathData: "M1 2 l3 4 L0 1 l-1 2" },
  output: {
    result: {
      absoluteCommands: [
        { command: "M", x: 1, y: 2 },
        { command: "L", x: 4, y: 6 },
        { command: "L", x: 0, y: 1 },
        { command: "L", x: -1, y: 3 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "svg/relative-line-command-accumulator",
  title: "Relative Line Command Accumulator",
  description:
    "Accumulate the bounded SVG M/m/L/l branch into absolute move/line coordinates, preserving subpath starts and implicit lineto expansion. Reject curves, closepath and incomplete coordinate pairs; not a complete SVG path renderer.",
  inputs: fields,
  outputs: [
    { id: "result", label: "Absolute move/line commands", kind: "object" },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
