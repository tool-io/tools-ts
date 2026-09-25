import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ symbol: string; alphabet: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "symbol", label: "Symbol", kind: "string" },
  {
    id: "alphabet",
    label: "Alphabet",
    kind: "string",
    enum: ["standard", "url"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.choice(i.alphabet, ["standard", "url"]);
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" +
    (i.alphabet === "standard" ? "+/" : "-_");
  H.check(i.symbol.length === 1 && chars.includes(i.symbol));
  return H.finish({ value: chars.indexOf(i.symbol) });
};
export const example = {
  input: { symbol: "-", alphabet: "url" },
  output: { result: { value: 62 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "decode/base64-alphabet-symbol-value",
  title: "Decoding: Base64 Alphabet Symbol Value Tool",
  description:
    "Resolve one RFC4648 Base64/Base64url data symbol to its six-bit value under an explicit alphabet, excluding equals padding.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
