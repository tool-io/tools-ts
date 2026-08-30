import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { fraction } from "../shared.js";

export type Input = Readonly<{
  readonly targetTransducedFraction: number;
}>;
export type Output = Readonly<{
  readonly requiredMoi: number;
}>;
export const calculate = (input: Input): Output => {
  fraction(input.targetTransducedFraction, "targetTransducedFraction");
  if (input.targetTransducedFraction === 1)
    simpleError(
      "targetTransducedFraction",
      "A finite Poisson MOI cannot achieve fraction one.",
    );
  return { requiredMoi: -Math.log1p(-input.targetTransducedFraction) };
};
export const exampleInput = { targetTransducedFraction: 0.9 } satisfies Input;
export const exampleOutput = {
  requiredMoi: 2.302585092994046,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/target-transduction-moi",
  title: "Target Transduction MOI",
  description:
    "Invert Poisson single-hit transduction probability to estimate an MOI for a supplied target fraction; susceptibility heterogeneity is not modeled.",
  inputs: [
    {
      id: "targetTransducedFraction",
      label: "Target transduced fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [{ id: "requiredMoi", label: "Required moi", kind: "number" }],
  calculate: (value) =>
    calculate({
      targetTransducedFraction: value.targetTransducedFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
