import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ word: string; width: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "word", label: "Word", kind: "string" },
  { id: "width", label: "Width", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const x = H.word(i.word, i.width),
    sign = 2n ** BigInt(i.width - 1);
  return H.finish({
    negativeZero: x === sign,
    negativeSign: x >= sign,
    magnitude: String(x & (sign - 1n)),
  });
};
export const example = {
  input: { word: "128", width: 8 },
  output: {
    result: { negativeZero: true, negativeSign: true, magnitude: "0" },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bitwise/sign-magnitude-signed-zero-tag",
  title: "Bitwise: Sign Magnitude Signed Zero Tag Tool",
  description:
    "Inspect a fixed-width sign-magnitude representation for its sign bit, exact magnitude and distinct negative-zero encoding.",
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
          magnitude: { type: "string" },
          negativeSign: { type: "boolean" },
          negativeZero: { type: "boolean" },
        },
        required: ["magnitude", "negativeSign", "negativeZero"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
