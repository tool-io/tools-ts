import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  firstLogit: number;
  secondLogit: number;
  temperature: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "firstLogit", label: "First logit", kind: "number" },
  { id: "secondLogit", label: "Second logit", kind: "number" },
  { id: "temperature", label: "Temperature", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.temperature);
  return H.finish({ logOdds: (i.firstLogit - i.secondLogit) / i.temperature });
};
export const example = {
  input: { firstLogit: 4, secondLogit: 2, temperature: 2 },
  output: { result: { logOdds: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "activation/softmax-pairwise-logit-odds",
  title: "Activation: Softmax Pairwise Logit Odds Tool",
  description:
    "Return the log of a softmax pair probability ratio directly from its two logits and explicit positive temperature, avoiding normalization/overflow.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { logOdds: { type: "number" } },
        required: ["logOdds"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
