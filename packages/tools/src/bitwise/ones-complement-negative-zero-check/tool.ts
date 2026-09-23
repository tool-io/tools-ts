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
  const x = H.word(i.word, i.width);
  return H.finish({ negativeZero: x === 2n ** BigInt(i.width) - 1n });
};
export const example = {
  input: { word: "255", width: 8 },
  output: { result: { negativeZero: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bitwise/ones-complement-negative-zero-check",
  title: "Bitwise: Ones Complement Negative Zero Check Tool",
  description:
    "Recognize the all-ones negative-zero representation in an explicitly sized ones-complement unsigned bit pattern.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { negativeZero: { type: "boolean" } },
        required: ["negativeZero"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
