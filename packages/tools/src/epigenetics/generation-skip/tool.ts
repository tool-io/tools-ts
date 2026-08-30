import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly ancestorGeneration: number;
  readonly descendantGeneration: number;
}>;
export type Output = Readonly<{
  readonly generationGap: number;
  readonly transgenerational: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.descendantGeneration < input.ancestorGeneration)
    simpleError(
      "descendantGeneration",
      "Descendant cannot precede ancestor.",
      "invalid_generations",
    );
  const generationGap = input.descendantGeneration - input.ancestorGeneration;
  return { generationGap, transgenerational: generationGap >= 2 };
};

export const exampleInput = {
  ancestorGeneration: 0,
  descendantGeneration: 2,
} satisfies Input;
export const exampleOutput = {
  generationGap: 2,
  transgenerational: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      ancestorGeneration: input.ancestorGeneration as number,
      descendantGeneration: input.descendantGeneration as number,
    }),
  description: "Count generations between exposure and observed effect.",
  id: "epigenetics/generation-skip",
  inputs: [
    {
      id: "ancestorGeneration",
      label: "Exposed ancestor generation",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "descendantGeneration",
      label: "Observed descendant generation",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "generationGap",
      label: "Generation gap",
      kind: "integer",
      minimum: 0,
    },
    { id: "transgenerational", label: "Transgenerational", kind: "boolean" },
  ],
  title: "Generation Skip",
});

export const run = tool.execute;
export default tool;
