import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ symbol: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "symbol", label: "Symbol", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const alphabet =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#";
  H.check(i.symbol.length === 1 && alphabet.includes(i.symbol));
  return H.finish({ value: alphabet.indexOf(i.symbol) });
};
export const example = {
  input: { symbol: "#" },
  output: { result: { value: 84 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "decode/z85-symbol-position-value",
  title: "Decoding: Z85 Symbol Position Value Tool",
  description:
    "Resolve one symbol in the published Z85 alphabet to its zero-based radix value; not an Ascii85 interchange.",
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
