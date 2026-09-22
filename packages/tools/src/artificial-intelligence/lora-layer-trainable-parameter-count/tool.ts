import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  inputDimension: number;
  outputDimension: number;
  rank: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "inputDimension", label: "Input dimension", kind: "integer" },
  { id: "outputDimension", label: "Output dimension", kind: "integer" },
  { id: "rank", label: "Rank", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  [i.inputDimension, i.outputDimension].forEach((x) => H.int(x, 1, 1000000000));
  H.int(i.rank, 1, Math.min(i.inputDimension, i.outputDimension));
  return H.finish({
    trainableParameters: String(
      BigInt(i.rank) * (BigInt(i.inputDimension) + BigInt(i.outputDimension)),
    ),
  });
};
export const example = {
  input: { inputDimension: 8, outputDimension: 12, rank: 2 },
  output: { result: { trainableParameters: "40" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "artificial-intelligence/lora-layer-trainable-parameter-count",
  title: "Artificial Intelligence: LoRA Layer Trainable Parameter Count Tool",
  description:
    "Count two bias-free low-rank adapter matrices r*in + out*r for one dense layer; excludes base weights, optimizer state and any trained biases.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { trainableParameters: { type: "string" } },
        required: ["trainableParameters"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
