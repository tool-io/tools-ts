import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ embeddingDimension: number; headCount: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "embeddingDimension", label: "Embedding dimension", kind: "integer" },
  { id: "headCount", label: "Head count", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.embeddingDimension, 1, 1000000000);
  H.int(i.headCount, 1, 1000000);
  return H.finish({
    divisible: i.embeddingDimension % i.headCount === 0,
    headDimension:
      i.embeddingDimension % i.headCount === 0
        ? i.embeddingDimension / i.headCount
        : 0,
  });
};
export const example = {
  input: { embeddingDimension: 768, headCount: 12 },
  output: { result: { divisible: true, headDimension: 64 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "artificial-intelligence/attention-head-dimension-check",
  title: "Artificial Intelligence: Attention Head Dimension Check Tool",
  description:
    "Check exact equal attention-head dimensional divisibility for one supplied embedding width; unused headDimension zero marks incompatibility, not a model architecture recommendation.",
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
          divisible: { type: "boolean" },
          headDimension: { type: "number" },
        },
        required: ["divisible", "headDimension"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
