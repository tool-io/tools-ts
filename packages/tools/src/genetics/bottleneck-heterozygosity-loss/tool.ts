import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { count, fraction } from "../shared.js";

export type Input = Readonly<{
  readonly initialHeterozygosity: number;
  readonly bottleneckDiploidSize: number;
  readonly generations: number;
}>;
export type Output = Readonly<{
  readonly retainedHeterozygosity: number;
  readonly lossFraction: number;
}>;
export const calculate = (input: Input): Output => {
  fraction(input.initialHeterozygosity, "initialHeterozygosity");
  count(input.bottleneckDiploidSize, "bottleneckDiploidSize", 1);
  count(input.generations, "generations");
  const retainedFraction =
    (1 - 1 / (2 * input.bottleneckDiploidSize)) ** input.generations;
  return {
    retainedHeterozygosity: input.initialHeterozygosity * retainedFraction,
    lossFraction: 1 - retainedFraction,
  };
};
export const exampleInput = {
  initialHeterozygosity: 0.5,
  bottleneckDiploidSize: 2,
  generations: 2,
} satisfies Input;
export const exampleOutput = {
  retainedHeterozygosity: 0.28125,
  lossFraction: 0.4375,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/bottleneck-heterozygosity-loss",
  title: "Bottleneck Heterozygosity Loss",
  description:
    "Project heterozygosity loss over a constant-size diploid bottleneck.",
  inputs: [
    {
      id: "initialHeterozygosity",
      label: "Initial heterozygosity",
      kind: "number",
    },
    {
      id: "bottleneckDiploidSize",
      label: "Bottleneck diploid size",
      kind: "integer",
    },
    { id: "generations", label: "Generations", kind: "integer" },
  ],
  outputs: [
    {
      id: "retainedHeterozygosity",
      label: "Retained heterozygosity",
      kind: "number",
    },
    { id: "lossFraction", label: "Loss fraction", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      initialHeterozygosity: value.initialHeterozygosity as number,
      bottleneckDiploidSize: value.bottleneckDiploidSize as number,
      generations: value.generations as number,
    }),
});
export const run = tool.execute;
export default tool;
