import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { fraction, positive } from "../shared.js";

export type Input = Readonly<{
  readonly fst: number;
}>;
export type Output = Readonly<{
  readonly estimatedMigrantsPerGeneration: number;
}>;
export const calculate = (input: Input): Output => {
  fraction(input.fst, "fst");
  positive(input.fst, "fst");
  return { estimatedMigrantsPerGeneration: (1 / input.fst - 1) / 4 };
};
export const exampleInput = { fst: 0.2 } satisfies Input;
export const exampleOutput = {
  estimatedMigrantsPerGeneration: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/island-model-gene-flow",
  title: "Island Model Gene Flow",
  description:
    "Estimate Nm from FST under the equilibrium diploid island model, not a direct migration measurement.",
  inputs: [{ id: "fst", label: "Fst", kind: "number" }],
  outputs: [
    {
      id: "estimatedMigrantsPerGeneration",
      label: "Estimated migrants per generation",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      fst: value.fst as number,
    }),
});
export const run = tool.execute;
export default tool;
