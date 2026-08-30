import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly mValue: number;
}>;
export type Output = Readonly<{
  readonly beta: number;
}>;

export const calculate = (input: Input): Output => {
  const beta = 1 / (1 + 2 ** -input.mValue);
  return { beta };
};

export const exampleInput = { mValue: 0 } satisfies Input;
export const exampleOutput = { beta: 0.5 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "epigenetics/methylation-beta-from-m",
  title: "Methylation Beta From M",
  description: "Invert a base-two methylation M-value into a beta fraction.",
  inputs: [{ id: "mValue", kind: "number", label: "M value" }],
  outputs: [{ id: "beta", kind: "number", label: "Beta" }],
  calculate: (value) =>
    calculate({
      mValue: value.mValue as number,
    }),
});
export const run = tool.execute;
export default tool;
