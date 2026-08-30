import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { fraction, positive } from "../shared.js";

export type Input = Readonly<{
  readonly priorRisk: number;
  readonly firstGenerationLikelihoodRatio: number;
  readonly secondGenerationLikelihoodRatio: number;
}>;
export type Output = Readonly<{
  readonly afterFirstGeneration: number;
  readonly afterSecondGeneration: number;
}>;
export const calculate = (input: Input): Output => {
  fraction(input.priorRisk, "priorRisk");
  positive(
    input.firstGenerationLikelihoodRatio,
    "firstGenerationLikelihoodRatio",
  );
  positive(
    input.secondGenerationLikelihoodRatio,
    "secondGenerationLikelihoodRatio",
  );
  const update = (p: number, lr: number) => (p * lr) / (1 - p + p * lr),
    afterFirstGeneration = update(
      input.priorRisk,
      input.firstGenerationLikelihoodRatio,
    );
  return {
    afterFirstGeneration,
    afterSecondGeneration: update(
      afterFirstGeneration,
      input.secondGenerationLikelihoodRatio,
    ),
  };
};
export const exampleInput = {
  priorRisk: 0.1,
  firstGenerationLikelihoodRatio: 2,
  secondGenerationLikelihoodRatio: 3,
} satisfies Input;
export const exampleOutput = {
  afterFirstGeneration: 0.18181818181818182,
  afterSecondGeneration: 0.4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/two-generation-bayes-update",
  title: "Two Generation Bayes Update",
  description:
    "Apply sequential family-evidence likelihood ratios from two generations to a prior risk.",
  inputs: [
    { id: "priorRisk", label: "Prior risk", kind: "number" },
    {
      id: "firstGenerationLikelihoodRatio",
      label: "First generation likelihood ratio",
      kind: "number",
    },
    {
      id: "secondGenerationLikelihoodRatio",
      label: "Second generation likelihood ratio",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "afterFirstGeneration",
      label: "After first generation",
      kind: "number",
    },
    {
      id: "afterSecondGeneration",
      label: "After second generation",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      priorRisk: value.priorRisk as number,
      firstGenerationLikelihoodRatio:
        value.firstGenerationLikelihoodRatio as number,
      secondGenerationLikelihoodRatio:
        value.secondGenerationLikelihoodRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
