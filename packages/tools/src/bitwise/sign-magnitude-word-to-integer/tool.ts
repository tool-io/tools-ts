import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  word: string;
  width: number;
  negativeZeroPolicy: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "word", label: "Word", kind: "string" },
  { id: "width", label: "Width", kind: "integer" },
  {
    id: "negativeZeroPolicy",
    label: "Negative zero policy",
    kind: "string",
    enum: ["canonical-zero", "preserve-tag"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const x = H.word(i.word, i.width),
    sign = 2n ** BigInt(i.width - 1),
    m = x & (sign - 1n);
  H.choice(i.negativeZeroPolicy, ["canonical-zero", "preserve-tag"]);
  return H.finish({
    integer: String(x >= sign ? -m : m),
    negativeZero: x === sign,
    preservedNegativeZero:
      x === sign && i.negativeZeroPolicy === "preserve-tag",
  });
};
export const example = {
  input: { word: "129", width: 8, negativeZeroPolicy: "preserve-tag" },
  output: {
    result: {
      integer: "-1",
      negativeZero: false,
      preservedNegativeZero: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bitwise/sign-magnitude-word-to-integer",
  title: "Bitwise: Sign Magnitude Word To Integer Tool",
  description:
    "Decode a fixed-width sign-magnitude word into an exact decimal integer with an explicit negative-zero tag policy, not twos complement.",
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
          integer: { type: "string" },
          negativeZero: { type: "boolean" },
          preservedNegativeZero: { type: "boolean" },
        },
        required: ["integer", "negativeZero", "preservedNegativeZero"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
