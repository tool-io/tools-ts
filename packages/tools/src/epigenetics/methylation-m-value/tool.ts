import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly beta: number;
}>;
export type Output = Readonly<{
  readonly mValue: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.beta <= 0 || input.beta >= 1)
    simpleError("beta", "Beta must lie strictly between zero and one.");
  return { mValue: Math.log2(input.beta / (1 - input.beta)) };
};

export const exampleInput = { beta: 0.5 } satisfies Input;
export const exampleOutput = { mValue: 0 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "epigenetics/methylation-m-value",
  title: "Methylation M Value",
  description:
    "Convert a methylation beta fraction into a base-two logit M-value.",
  inputs: [{ id: "beta", kind: "number", label: "Beta" }],
  outputs: [{ id: "mValue", kind: "number", label: "M value" }],
  calculate: (value) =>
    calculate({
      beta: value.beta as number,
    }),
});
export const run = tool.execute;
export default tool;
