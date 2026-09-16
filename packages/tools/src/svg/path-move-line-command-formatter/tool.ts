import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  records,
} from "../batch53-shared.js";

export type Input = Readonly<{ commandsJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "commandsJson", label: "Commands json", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const a = records(i.commandsJson);
  const commands = a.map((r, j) => {
    if (
      typeof r.command !== "string" ||
      !["M", "m", "L", "l"].includes(r.command) ||
      typeof r.x !== "number" ||
      typeof r.y !== "number" ||
      Object.keys(r).some((k) => !["command", "x", "y"].includes(k)) ||
      (j === 0 && !["M", "m"].includes(r.command))
    )
      simpleError(
        "commands",
        "Explicit M/m/L/l records, starting with moveto.",
      );
    return r.command + String(r.x) + " " + String(r.y);
  });
  return { pathData: commands.join(" ") };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    commandsJson: '[{"command":"M","x":0,"y":0},{"command":"L","x":1,"y":2}]',
  },
  output: { result: { pathData: "M0 0 L1 2" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "svg/path-move-line-command-formatter",
  title: "SVG Move Line Command Formatter",
  description:
    "Format explicit finite M/m/L/l command records for the bounded move/line SVG branch; no other SVG grammar is accepted.",
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
