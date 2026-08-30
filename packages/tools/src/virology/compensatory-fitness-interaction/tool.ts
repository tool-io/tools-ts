import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly wildTypeFitness: number;
  readonly firstMutationFitness: number;
  readonly secondMutationFitness: number;
  readonly doubleMutationFitness: number;
}>;
export type Output = Readonly<{
  readonly multiplicativeExpectedFitness: number;
  readonly interactionExcess: number;
  readonly rescuesFirstMutation: boolean;
}>;
export const calculate = (input: Input): Output => {
  positive(input.wildTypeFitness, "wildTypeFitness");
  nonnegative(input.firstMutationFitness, "firstMutationFitness");
  nonnegative(input.secondMutationFitness, "secondMutationFitness");
  nonnegative(input.doubleMutationFitness, "doubleMutationFitness");
  const multiplicativeExpectedFitness =
    (input.firstMutationFitness * input.secondMutationFitness) /
    input.wildTypeFitness;
  return {
    multiplicativeExpectedFitness,
    interactionExcess:
      input.doubleMutationFitness - multiplicativeExpectedFitness,
    rescuesFirstMutation:
      input.doubleMutationFitness > input.firstMutationFitness,
  };
};
export const exampleInput = {
  wildTypeFitness: 1,
  firstMutationFitness: 0.5,
  secondMutationFitness: 0.8,
  doubleMutationFitness: 0.7,
} satisfies Input;
export const exampleOutput = {
  multiplicativeExpectedFitness: 0.4,
  interactionExcess: 0.3,
  rescuesFirstMutation: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/compensatory-fitness-interaction",
  title: "Compensatory Fitness Interaction",
  description:
    "Compare double-mutant fitness with a multiplicative single-mutant expectation and observed rescue of the first mutation.",
  inputs: [
    { id: "wildTypeFitness", label: "Wild type fitness", kind: "number" },
    {
      id: "firstMutationFitness",
      label: "First mutation fitness",
      kind: "number",
      minimum: 0,
    },
    {
      id: "secondMutationFitness",
      label: "Second mutation fitness",
      kind: "number",
      minimum: 0,
    },
    {
      id: "doubleMutationFitness",
      label: "Double mutation fitness",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "multiplicativeExpectedFitness",
      label: "Multiplicative expected fitness",
      kind: "number",
    },
    { id: "interactionExcess", label: "Interaction excess", kind: "number" },
    {
      id: "rescuesFirstMutation",
      label: "Rescues first mutation",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      wildTypeFitness: value.wildTypeFitness as number,
      firstMutationFitness: value.firstMutationFitness as number,
      secondMutationFitness: value.secondMutationFitness as number,
      doubleMutationFitness: value.doubleMutationFitness as number,
    }),
});
export const run = tool.execute;
export default tool;
