import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly oneRepMaxKg: number;
  readonly trainingFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly trainingLoadsKg: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  if (
    input.oneRepMaxKg <= 0 ||
    !input.trainingFractions.length ||
    input.trainingFractions.some((v) => v <= 0 || v > 1)
  )
    simpleError(
      "trainingFractions",
      "Positive one-rep max and training fractions in (0,1] required.",
    );
  return {
    trainingLoadsKg: input.trainingFractions.map((v) => input.oneRepMaxKg * v),
  };
};
export const exampleInput = {
  oneRepMaxKg: 100,
  trainingFractions: [0.6, 0.8],
} satisfies Input;
export const exampleOutput = { trainingLoadsKg: [60, 80] } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/one-rep-max-training-loads",
  title: "One Rep Max Training Loads",
  description:
    "Generate lift training loads from a measured one-rep max and chosen fractions.",
  inputs: [
    { id: "oneRepMaxKg", label: "One rep max kg", kind: "number" },
    {
      id: "trainingFractions",
      label: "Training fractions",
      kind: "numberList",
    },
  ],
  outputs: [
    { id: "trainingLoadsKg", label: "Training loads kg", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      oneRepMaxKg: value.oneRepMaxKg as number,
      trainingFractions: value.trainingFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
