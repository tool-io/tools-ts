import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ sign: string; convention: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "sign",
    label: "Sign",
    kind: "string",
    enum: ["negative", "positive", "unsigned"],
  },
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
  H.choice(i.sign, ["negative", "positive", "unsigned"]);
  return H.finish({
    nibble: i.sign === "negative" ? 13 : i.sign === "positive" ? 12 : 15,
  });
};
export const example = {
  input: { sign: "negative", convention: "canonical-CDF" },
  output: { result: { nibble: 13 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "encode/signed-bcd-trailing-nibble",
  title: "Encoding: Signed BCD Trailing Nibble Tool",
  description:
    "Encode one canonical C-positive/D-negative/F-unsigned packed-decimal sign nibble under an explicit restricted convention; no complete decimal field.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { nibble: { type: "number" } },
        required: ["nibble"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
