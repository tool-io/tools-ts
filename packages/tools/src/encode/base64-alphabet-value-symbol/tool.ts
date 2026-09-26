import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ value: number; alphabet: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "value", label: "Value", kind: "integer" },
  {
    id: "alphabet",
    label: "Alphabet",
    kind: "string",
    enum: ["standard", "url"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.value, 0, 63);
  H.choice(i.alphabet, ["standard", "url"]);
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" +
    (i.alphabet === "standard" ? "+/" : "-_");
  return H.finish({ symbol: chars[i.value] });
};
export const example = {
  input: { value: 62, alphabet: "standard" },
  output: { result: { symbol: "+" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "encode/base64-alphabet-value-symbol",
  title: "Encoding: Base64 Alphabet Value Symbol Tool",
  description:
    "Encode one six-bit value as an RFC4648 Base64/Base64url data symbol under an explicit alphabet; excludes padding and byte grouping.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { symbol: { type: "string" } },
        required: ["symbol"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
