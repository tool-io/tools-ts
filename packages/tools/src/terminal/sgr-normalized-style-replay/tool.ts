import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ parameters: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "parameters", label: "parameters", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ style: H.replaySgr(i.parameters) });
};
export const example = {
  input: { parameters: [1, 31] },
  output: {
    result: {
      style: {
        bold: true,
        faint: false,
        italic: false,
        underline: false,
        inverse: false,
        strike: false,
        foreground: "index:1",
        background: "default",
      },
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "terminal/sgr-normalized-style-replay",
  title: "Terminal SGR Normalized Style Replay",
  description:
    "Replay the documented finite SGR subset from default style: intensity, italic, underline, inverse, strike, basic/indexed/RGB colors; unsupported codes reject instead of being guessed.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
