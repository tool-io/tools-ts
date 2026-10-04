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
  const kind =
    i.codepoint === 0xa0 || i.codepoint === 0x202f
      ? "GL-no-break"
      : i.codepoint === 0x20
        ? "SP-breakable"
        : "other";
  return H.finish({ knownSpace: kind !== "other", lineBreakClass: kind });
};
export const example = {
  input: { codepoint: 160 },
  output: { result: { knownSpace: true, lineBreakClass: "GL-no-break" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/whitespace-nobreak-vs-breakable-label",
  title: "Text: Whitespace Nobreak Vs Breakable Label Tool",
  description:
    "Classify only ordinary space U+0020 and no-break spaces U+00A0/U+202F into their Unicode line-break classes; not a full Unicode line-breaking engine.",
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
          knownSpace: { type: "boolean" },
          lineBreakClass: { type: "string" },
        },
        required: ["knownSpace", "lineBreakClass"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
