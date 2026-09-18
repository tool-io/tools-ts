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
  const m = /^\[([0-9;]*)m(?![\s\S])/.exec(i.token);
  H.check(m);
  return H.finish({
    parameters:
      m![1] === ""
        ? [0]
        : m![1]
            .split(";")
            .map((x) => (x === "" ? 0 : H.int(Number(x), 0, 255))),
  });
};
export const example = {
  input: { token: "\u001b[1;31m" },
  output: { result: { parameters: [1, 31] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "terminal/sgr-parameter-list-parser",
  title: "Terminal SGR Parameter List Parser",
  description:
    "Parse one seven-bit ESC[ semicolon-only SGR token with empty parameters defaulting to zero; no colon subparameters, C1 CSI or unsupported numeric ranges.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
