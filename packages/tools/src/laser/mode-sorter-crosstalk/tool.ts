import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly confusionMatrix: readonly number[];
  readonly modeCount: number;
}>;
export type Output = Readonly<{
  readonly sortingEfficiencyPercent: number;
  readonly crosstalkPercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.confusionMatrix.length !== input.modeCount ** 2 ||
    input.confusionMatrix.some((value) => value < 0)
  )
    simpleError(
      "confusionMatrix",
      "Matrix must be square, aligned to mode count, and nonnegative.",
      "invalid_matrix",
    );
  const total = input.confusionMatrix.reduce((a, b) => a + b, 0);
  if (total <= 0)
    simpleError(
      "confusionMatrix",
      "Total measured power must be positive.",
      "zero_power",
    );
  let diagonal = 0;
  for (let i = 0; i < input.modeCount; i += 1)
    diagonal += input.confusionMatrix[i * input.modeCount + i];
  const sortingEfficiencyPercent = (diagonal / total) * 100;
  return {
    sortingEfficiencyPercent,
    crosstalkPercent: 100 - sortingEfficiencyPercent,
  };
};

export const exampleInput = {
  confusionMatrix: [9, 1, 2, 8],
  modeCount: 2,
} satisfies Input;
export const exampleOutput = {
  sortingEfficiencyPercent: 85,
  crosstalkPercent: 15,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      confusionMatrix: input.confusionMatrix as readonly number[],
      modeCount: input.modeCount as number,
    }),
  description:
    "Calculate diagonal mode-sorting efficiency and off-diagonal crosstalk.",
  id: "laser/mode-sorter-crosstalk",
  inputs: [
    {
      id: "confusionMatrix",
      label: "Flattened square power matrix",
      kind: "numberList",
    },
    { id: "modeCount", label: "Mode count", kind: "integer", minimum: 1 },
  ],
  outputs: [
    {
      id: "sortingEfficiencyPercent",
      label: "Diagonal sorting efficiency",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "crosstalkPercent",
      label: "Off-diagonal crosstalk",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  title: "Mode-Sorter Crosstalk",
});

export const run = tool.execute;
export default tool;
