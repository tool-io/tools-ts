import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ token: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "token", label: "Token", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(/^i(?:0|-?[1-9]\d{0,126})e(?![\s\S])/.test(i.token));
  return H.finish({ integer: String(H.big(i.token.slice(1, -1))) });
};
export const example = {
  input: { token: "i-12e" },
  output: { result: { integer: "-12" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "decode/bencode-integer-token",
  title: "Decoding: Bencode Integer Token Tool",
  description:
    "Parse one canonical bencode integer token into exact decimal text, rejecting leading zeros, plus signs and negative zero; no dictionary/list decoding.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { integer: { type: "string" } },
        required: ["integer"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
