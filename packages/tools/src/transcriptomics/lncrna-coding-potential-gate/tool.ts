import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly codingPotential: number;
  readonly maximumNoncodingScore: number;
}>;
export type Output = Readonly<{
  readonly nonCoding: boolean;
  readonly scoreMargin: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.codingPotential < 0 ||
    input.codingPotential > 1 ||
    input.maximumNoncodingScore < 0 ||
    input.maximumNoncodingScore > 1
  )
    simpleError(
      "codingPotential",
      "Coding probabilities must be within [0,1].",
    );
  return {
    nonCoding: input.codingPotential <= input.maximumNoncodingScore,
    scoreMargin: input.maximumNoncodingScore - input.codingPotential,
  };
};

export const exampleInput = {
  codingPotential: 0.2,
  maximumNoncodingScore: 0.4,
} satisfies Input;
export const exampleOutput = {
  nonCoding: true,
  scoreMargin: 0.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/lncrna-coding-potential-gate",
  title: "lncRNA Coding Potential Gate",
  description: "Gate a supplied lncRNA coding-potential probability.",
  inputs: [
    { id: "codingPotential", kind: "number", label: "Coding potential" },
    {
      id: "maximumNoncodingScore",
      kind: "number",
      label: "Maximum noncoding score",
    },
  ],
  outputs: [
    { id: "nonCoding", kind: "boolean", label: "Non coding" },
    { id: "scoreMargin", kind: "number", label: "Score margin" },
  ],
  calculate: (value) =>
    calculate({
      codingPotential: value.codingPotential as number,
      maximumNoncodingScore: value.maximumNoncodingScore as number,
    }),
});
export const run = tool.execute;
export default tool;
