import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly measuredSpacingsHertz: readonly number[];
  readonly targetSpacingHertz: number;
}>;
export type Output = Readonly<{
  readonly meanSpacingHertz: number;
  readonly meanErrorHertz: number;
  readonly rmsErrorHertz: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.measuredSpacingsHertz.length === 0)
    simpleError(
      "measuredSpacingsHertz",
      "At least one measured spacing is required.",
      "empty_samples",
    );
  const meanSpacingHertz =
    input.measuredSpacingsHertz.reduce((a, b) => a + b, 0) /
    input.measuredSpacingsHertz.length;
  return {
    meanSpacingHertz,
    meanErrorHertz: meanSpacingHertz - input.targetSpacingHertz,
    rmsErrorHertz: Math.sqrt(
      input.measuredSpacingsHertz.reduce(
        (sum, value) => sum + (value - input.targetSpacingHertz) ** 2,
        0,
      ) / input.measuredSpacingsHertz.length,
    ),
  };
};

export const exampleInput = {
  measuredSpacingsHertz: [99, 101],
  targetSpacingHertz: 100,
} satisfies Input;
export const exampleOutput = {
  meanSpacingHertz: 100,
  meanErrorHertz: 0,
  rmsErrorHertz: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      measuredSpacingsHertz: input.measuredSpacingsHertz as readonly number[],
      targetSpacingHertz: input.targetSpacingHertz as number,
    }),
  description: "Summarize gain-switched comb spacing lock error.",
  id: "laser/comb-spacing-lock",
  inputs: [
    {
      id: "measuredSpacingsHertz",
      label: "Measured comb spacings",
      kind: "numberList",
      unit: "Hz",
    },
    {
      id: "targetSpacingHertz",
      label: "Target spacing",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
  ],
  outputs: [
    {
      id: "meanSpacingHertz",
      label: "Mean spacing",
      kind: "number",
      unit: "Hz",
    },
    {
      id: "meanErrorHertz",
      label: "Mean spacing error",
      kind: "number",
      unit: "Hz",
    },
    {
      id: "rmsErrorHertz",
      label: "RMS spacing error",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
  ],
  title: "Comb Spacing Lock",
});

export const run = tool.execute;
export default tool;
