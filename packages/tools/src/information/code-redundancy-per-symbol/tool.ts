import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ averageCodeLength: number; entropy: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "averageCodeLength", label: "Average code length", kind: "number" },
  { id: "entropy", label: "Entropy", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.entropy >= 0 && i.averageCodeLength >= i.entropy);
  return H.finish({
    redundancy: i.averageCodeLength - i.entropy,
    relativeRedundancy:
      i.averageCodeLength === 0 ? 0 : 1 - i.entropy / i.averageCodeLength,
  });
};
export const example = {
  input: { averageCodeLength: 3, entropy: 2 },
  output: { result: { redundancy: 1, relativeRedundancy: 0.3333333333333333 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "information/code-redundancy-per-symbol",
  title: "Information: Code Redundancy Per Symbol Tool",
  description:
    "Compute absolute and relative per-symbol code redundancy from compatible supplied mean length and entropy, rejecting impossible negative redundancy.",
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
          redundancy: { type: "number" },
          relativeRedundancy: { type: "number" },
        },
        required: ["redundancy", "relativeRedundancy"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
