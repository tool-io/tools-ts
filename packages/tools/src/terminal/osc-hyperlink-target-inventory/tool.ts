import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ text: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "text", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const tokens = H.escapeTokens(i.text);
  return H.finish({
    targets: tokens.flatMap((v) => {
      if (v.type !== "OSC") return [];
      H.check(v.complete);
      const body = v.text.slice(2, v.text.endsWith("") ? -1 : -2);
      if (!body.startsWith("8;")) return [];
      const j = body.indexOf(";", 2);
      H.check(j >= 0);
      return [
        {
          start: v.start,
          end: v.end,
          parameters: body.slice(2, j),
          target: body.slice(j + 1),
        },
      ];
    }),
  });
};
export const example = {
  input: { text: "\u001b]8;;x\u0007" },
  output: {
    result: { targets: [{ start: 0, end: 7, parameters: "", target: "x" }] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "terminal/osc-hyperlink-target-inventory",
  title: "Terminal OSC Hyperlink Target Inventory",
  description:
    "Inventory explicit OSC 8 open/close hyperlink target observations from complete seven-bit OSC tokens; parameters/targets remain literal, no URL resolution or rendering.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
