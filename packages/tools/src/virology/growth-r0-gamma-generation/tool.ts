import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive } from "../shared.js";

export type Input = Readonly<{
  readonly growthRatePerDay: number;
  readonly meanGenerationDays: number;
  readonly generationShape: number;
}>;
export type Output = Readonly<{
  readonly reproductionNumber: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.meanGenerationDays, "meanGenerationDays");
  positive(input.generationShape, "generationShape");
  const base =
    1 +
    (input.growthRatePerDay * input.meanGenerationDays) / input.generationShape;
  positive(base, "growthRatePerDay");
  return { reproductionNumber: base ** input.generationShape };
};
export const exampleInput = {
  growthRatePerDay: 0.1,
  meanGenerationDays: 5,
  generationShape: 2,
} satisfies Input;
export const exampleOutput = { reproductionNumber: 1.5625 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/growth-r0-gamma-generation",
  title: "Growth R0 Gamma Generation",
  description:
    "Use the Euler–Lotka relation for a gamma generation-interval model to infer reproduction number from exponential growth.",
  inputs: [
    { id: "growthRatePerDay", label: "Growth rate per day", kind: "number" },
    { id: "meanGenerationDays", label: "Mean generation days", kind: "number" },
    { id: "generationShape", label: "Generation shape", kind: "number" },
  ],
  outputs: [
    { id: "reproductionNumber", label: "Reproduction number", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      growthRatePerDay: value.growthRatePerDay as number,
      meanGenerationDays: value.meanGenerationDays as number,
      generationShape: value.generationShape as number,
    }),
});
export const run = tool.execute;
export default tool;
