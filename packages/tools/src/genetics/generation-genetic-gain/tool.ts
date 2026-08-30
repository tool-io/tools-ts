import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { count, positive } from "../shared.js";

export type Input = Readonly<{
  readonly initialTraitMean: number;
  readonly currentTraitMean: number;
  readonly elapsedGenerations: number;
}>;
export type Output = Readonly<{
  readonly absoluteGainPerGeneration: number;
  readonly compoundGainPercent: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.initialTraitMean, "initialTraitMean");
  positive(input.currentTraitMean, "currentTraitMean");
  count(input.elapsedGenerations, "elapsedGenerations", 1);
  return {
    absoluteGainPerGeneration:
      (input.currentTraitMean - input.initialTraitMean) /
      input.elapsedGenerations,
    compoundGainPercent:
      100 *
      ((input.currentTraitMean / input.initialTraitMean) **
        (1 / input.elapsedGenerations) -
        1),
  };
};
export const exampleInput = {
  initialTraitMean: 100,
  currentTraitMean: 121,
  elapsedGenerations: 2,
} satisfies Input;
export const exampleOutput = {
  absoluteGainPerGeneration: 10.5,
  compoundGainPercent: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/generation-genetic-gain",
  title: "Generation Genetic Gain",
  description:
    "Compare absolute and compounded observed trait improvement per generation.",
  inputs: [
    { id: "initialTraitMean", label: "Initial trait mean", kind: "number" },
    { id: "currentTraitMean", label: "Current trait mean", kind: "number" },
    { id: "elapsedGenerations", label: "Elapsed generations", kind: "integer" },
  ],
  outputs: [
    {
      id: "absoluteGainPerGeneration",
      label: "Absolute gain per generation",
      kind: "number",
    },
    {
      id: "compoundGainPercent",
      label: "Compound gain percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      initialTraitMean: value.initialTraitMean as number,
      currentTraitMean: value.currentTraitMean as number,
      elapsedGenerations: value.elapsedGenerations as number,
    }),
});
export const run = tool.execute;
export default tool;
