import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ token: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "token", label: "token", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const m = /^\[([0-3]?)([JK])(?![\s\S])/.exec(i.token);
  H.check(m && !(m![2] === "K" && m![1] === "3"));
  return H.finish({
    kind: m![2] === "J" ? "display" : "line",
    mode: Number(m![1] || 0),
  });
};
export const example = {
  input: { token: "\u001b[2J" },
  output: { result: { kind: "display", mode: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "terminal/csi-erase-mode-token-parser",
  title: "Terminal CSI Erase Mode Token Parser",
  description:
    "Parse complete CSI erase-display/erase-line tokens with modes 0\u20132 or display-only mode 3; returns lexical evidence without terminal effects.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
