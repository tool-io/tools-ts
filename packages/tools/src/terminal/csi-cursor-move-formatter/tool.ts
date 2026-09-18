import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ direction: string; count: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "direction", label: "direction", kind: "string" },
  { id: "count", label: "count", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.count, 1, 1e6);
  const finals: Record<string, string> = {
    up: "A",
    down: "B",
    right: "C",
    left: "D",
  };
  H.check(Object.hasOwn(finals, i.direction));
  return H.finish({ token: "[" + i.count + finals[i.direction] });
};
export const example = {
  input: { direction: "left", count: 2 },
  output: { result: { token: "\u001b[2D" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "terminal/csi-cursor-move-formatter",
  title: "Terminal CSI Cursor Move Formatter",
  description:
    "Format a supported relative CSI cursor movement token with positive explicit count; directions are up/down/right/left only, no terminal execution.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
