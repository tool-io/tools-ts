import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly firstTransitionMegahertz: number;
  readonly secondTransitionMegahertz: number;
}>;
export type Output = Readonly<{
  readonly crossoverFrequencyMegahertz: number;
  readonly separationMegahertz: number;
}>;

export const calculate = (input: Input): Output => {
  return {
    crossoverFrequencyMegahertz:
      (input.firstTransitionMegahertz + input.secondTransitionMegahertz) / 2,
    separationMegahertz: Math.abs(
      input.secondTransitionMegahertz - input.firstTransitionMegahertz,
    ),
  };
};

export const exampleInput = {
  firstTransitionMegahertz: 100,
  secondTransitionMegahertz: 120,
} satisfies Input;
export const exampleOutput = {
  crossoverFrequencyMegahertz: 110,
  separationMegahertz: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      firstTransitionMegahertz: input.firstTransitionMegahertz as number,
      secondTransitionMegahertz: input.secondTransitionMegahertz as number,
    }),
  description:
    "Calculate the saturated-absorption crossover frequency between two transitions.",
  id: "laser/saturation-crossover-frequency",
  inputs: [
    {
      id: "firstTransitionMegahertz",
      label: "First transition frequency",
      kind: "number",
      unit: "MHz",
    },
    {
      id: "secondTransitionMegahertz",
      label: "Second transition frequency",
      kind: "number",
      unit: "MHz",
    },
  ],
  outputs: [
    {
      id: "crossoverFrequencyMegahertz",
      label: "Crossover frequency",
      kind: "number",
      unit: "MHz",
    },
    {
      id: "separationMegahertz",
      label: "Transition separation",
      kind: "number",
      minimum: 0,
      unit: "MHz",
    },
  ],
  title: "Saturation Crossover Frequency",
});

export const run = tool.execute;
export default tool;
