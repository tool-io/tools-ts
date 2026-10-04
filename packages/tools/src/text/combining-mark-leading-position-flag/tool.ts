import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ text: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    leadingCombiningMark: i.text.length > 0 && /^\p{M}/u.test(i.text),
    firstCodepoint: i.text.length === 0 ? -1 : i.text.codePointAt(0)!,
  });
};
export const example = {
  input: { text: "\u0301a" },
  output: { result: { leadingCombiningMark: true, firstCodepoint: 769 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/combining-mark-leading-position-flag",
  title: "Text: Combining Mark Leading Position Flag Tool",
  description:
    "Check whether the first scalar of a string has Unicode Mark general category using the runtime Unicode property table; not grapheme segmentation or a validity judgment.",
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
          firstCodepoint: { type: "number" },
          leadingCombiningMark: { type: "boolean" },
        },
        required: ["firstCodepoint", "leadingCombiningMark"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
