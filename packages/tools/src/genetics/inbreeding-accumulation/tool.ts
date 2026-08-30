import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count, fraction, positive } from "../shared.js";

export type Input = Readonly<{
  readonly initialInbreeding: number;
  readonly effectiveSize: number;
  readonly generations: number;
}>;
export type Output = Readonly<{
  readonly deltaFPerGeneration: number;
  readonly finalInbreeding: number;
}>;
export const calculate = (input: Input): Output => {
  fraction(input.initialInbreeding, "initialInbreeding");
  positive(input.effectiveSize, "effectiveSize");
  if (input.effectiveSize < 0.5)
    simpleError(
      "effectiveSize",
      "Diploid effective size must be at least one-half.",
    );
  count(input.generations, "generations");
  const deltaFPerGeneration = 1 / (2 * input.effectiveSize);
  return {
    deltaFPerGeneration,
    finalInbreeding:
      1 -
      (1 - input.initialInbreeding) *
        (1 - deltaFPerGeneration) ** input.generations,
  };
};
export const exampleInput = {
  initialInbreeding: 0.1,
  effectiveSize: 5,
  generations: 2,
} satisfies Input;
export const exampleOutput = {
  deltaFPerGeneration: 0.1,
  finalInbreeding: 0.271,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/inbreeding-accumulation",
  title: "Inbreeding Accumulation",
  description:
    "Project accumulated inbreeding using an explicit initial coefficient and constant effective size.",
  inputs: [
    { id: "initialInbreeding", label: "Initial inbreeding", kind: "number" },
    { id: "effectiveSize", label: "Effective size", kind: "number" },
    { id: "generations", label: "Generations", kind: "integer" },
  ],
  outputs: [
    {
      id: "deltaFPerGeneration",
      label: "Delta f per generation",
      kind: "number",
    },
    { id: "finalInbreeding", label: "Final inbreeding", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      initialInbreeding: value.initialInbreeding as number,
      effectiveSize: value.effectiveSize as number,
      generations: value.generations as number,
    }),
});
export const run = tool.execute;
export default tool;
