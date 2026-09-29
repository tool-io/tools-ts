import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ entropy: number; base: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "entropy", label: "Entropy", kind: "number" },
  { id: "base", label: "Base", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.entropy >= 0 && i.base > 1);
  return H.finish({
    effectiveAlphabetSize: Math.exp(i.entropy * Math.log(i.base)),
  });
};
export const example = {
  input: { entropy: 3, base: 2 },
  output: { result: { effectiveAlphabetSize: 8 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "information/entropy-effective-alphabet-size",
  title: "Information: Entropy Effective Alphabet Size Tool",
  description:
    "Exponentiate a nonnegative entropy in its explicitly supplied base to an effective equally likely alphabet size; not literal observed category count.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { effectiveAlphabetSize: { type: "number" } },
        required: ["effectiveAlphabetSize"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
