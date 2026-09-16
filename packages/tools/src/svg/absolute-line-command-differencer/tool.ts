import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ commandsJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "commandsJson", kind: "string", label: "commandsJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.records(i.commandsJson);
  let x = 0,
    y = 0;
  const commands = r.map((v) => {
    const command = H.str(v.command);
    H.check(command === "M" || command === "L");
    const nx = H.num(v.x),
      ny = H.num(v.y);
    const t = { command: command.toLowerCase(), x: nx - x, y: ny - y };
    x = nx;
    y = ny;
    return t;
  });
  return H.finish({ relativeCommands: commands });
};
export const example = {
  input: {
    commandsJson: '[{"command":"M","x":1,"y":2},{"command":"L","x":4,"y":6}]',
  },
  output: {
    result: {
      relativeCommands: [
        { command: "m", x: 1, y: 2 },
        { command: "l", x: 3, y: 4 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "svg/absolute-line-command-differencer",
  title: "Absolute Line Command Differencer",
  description:
    "Difference explicit absolute SVG M/L commands against the preceding current point, initially the origin; no curves or closepath.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
