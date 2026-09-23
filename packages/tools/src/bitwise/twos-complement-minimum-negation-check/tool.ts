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
    modulus = 2n ** BigInt(i.width);
  return H.finish({
    negatedWord: String((modulus - x) % modulus),
    overflow: x === modulus / 2n,
  });
};
export const example = {
  input: { word: "128", width: 8 },
  output: { result: { negatedWord: "128", overflow: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bitwise/twos-complement-minimum-negation-check",
  title: "Bitwise: Twos Complement Minimum Negation Check Tool",
  description:
    "Negate one twos-complement bit pattern at fixed width, exposing the unique minimum-integer overflow case.",
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
          negatedWord: { type: "string" },
          overflow: { type: "boolean" },
        },
        required: ["negatedWord", "overflow"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
