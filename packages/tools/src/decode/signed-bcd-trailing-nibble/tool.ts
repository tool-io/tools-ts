import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ nibble: number; convention: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "nibble", label: "Nibble", kind: "integer" },
  {
    id: "convention",
    label: "Convention",
    kind: "string",
    enum: ["canonical-CDF"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.choice(i.convention, ["canonical-CDF"]);
  H.check([12, 13, 15].includes(i.nibble));
  return H.finish({ negative: i.nibble === 13, unsigned: i.nibble === 15 });
};
export const example = {
  input: { nibble: 13, convention: "canonical-CDF" },
  output: { result: { negative: true, unsigned: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "decode/signed-bcd-trailing-nibble",
  title: "Decoding: Signed BCD Trailing Nibble Tool",
  description:
    "Decode the explicitly restricted canonical packed-decimal sign nibbles C positive, D negative, F unsigned; historical alternate A/B/E signs are intentionally not inferred.",
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
          negative: { type: "boolean" },
          unsigned: { type: "boolean" },
        },
        required: ["negative", "unsigned"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
