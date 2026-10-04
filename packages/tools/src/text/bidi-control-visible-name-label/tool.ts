import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ codepoint: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "codepoint", label: "Codepoint", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.scalar(i.codepoint);
  const names: Record<number, string> = {
      1564: "ARABIC LETTER MARK",
      8206: "LEFT-TO-RIGHT MARK",
      8207: "RIGHT-TO-LEFT MARK",
      8234: "LEFT-TO-RIGHT EMBEDDING",
      8235: "RIGHT-TO-LEFT EMBEDDING",
      8236: "POP DIRECTIONAL FORMATTING",
      8237: "LEFT-TO-RIGHT OVERRIDE",
      8238: "RIGHT-TO-LEFT OVERRIDE",
      8294: "LEFT-TO-RIGHT ISOLATE",
      8295: "RIGHT-TO-LEFT ISOLATE",
      8296: "FIRST STRONG ISOLATE",
      8297: "POP DIRECTIONAL ISOLATE",
    },
    label = names[i.codepoint] ?? "other";
  return H.finish({ bidiControl: label !== "other", label });
};
export const example = {
  input: { codepoint: 8238 },
  output: { result: { bidiControl: true, label: "RIGHT-TO-LEFT OVERRIDE" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/bidi-control-visible-name-label",
  title: "Text: Bidi Control Visible Name Label Tool",
  description:
    "Name one of the twelve Unicode Bidi_Control code points for visible inspection, without applying the bidirectional layout algorithm.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          bidiControl: { type: "boolean" },
          label: { type: "string" },
        },
        required: ["bidiControl", "label"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
