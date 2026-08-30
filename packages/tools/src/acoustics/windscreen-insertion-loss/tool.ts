import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly frequencyHertz: number;
  readonly levelWithWindscreenDecibels: number;
  readonly levelWithoutWindscreenDecibels: number;
}>;
export type Output = Readonly<{
  readonly frequencyHertz: number;
  readonly insertionLossDecibels: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    !Number.isFinite(input.frequencyHertz) ||
    input.frequencyHertz <= 0 ||
    !Number.isFinite(input.levelWithWindscreenDecibels) ||
    !Number.isFinite(input.levelWithoutWindscreenDecibels)
  )
    simpleError(
      "frequencyHertz",
      "Frequency must be positive and levels finite.",
      "invalid_value",
    );
  const insertionLossDecibels =
    input.levelWithoutWindscreenDecibels - input.levelWithWindscreenDecibels;
  if (!Number.isFinite(insertionLossDecibels))
    simpleError(
      "levelWithoutWindscreenDecibels",
      "Insertion loss is out of range.",
      "numeric_overflow",
    );
  return { frequencyHertz: input.frequencyHertz, insertionLossDecibels };
};

export const example = {
  input: {
    frequencyHertz: 8000,
    levelWithWindscreenDecibels: 68,
    levelWithoutWindscreenDecibels: 70,
  },
  output: { frequencyHertz: 8000, insertionLossDecibels: 2 },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: {
    frequencyHertz: 1000,
    levelWithWindscreenDecibels: 70,
    levelWithoutWindscreenDecibels: 70,
  },
  output: { frequencyHertz: 1000, insertionLossDecibels: 0 },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      frequencyHertz: input.frequencyHertz as number,
      levelWithWindscreenDecibels: input.levelWithWindscreenDecibels as number,
      levelWithoutWindscreenDecibels:
        input.levelWithoutWindscreenDecibels as number,
    }),
  description:
    "Calculate measured windscreen insertion loss at a caller-specified frequency without generalizing it to other windscreens or incidence conditions.",
  id: "acoustics/windscreen-insertion-loss",
  inputs: [
    {
      id: "frequencyHertz",
      kind: "number",
      label: "Frequency",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "levelWithWindscreenDecibels",
      kind: "number",
      label: "Level with windscreen",
      unit: "dB",
    },
    {
      id: "levelWithoutWindscreenDecibels",
      kind: "number",
      label: "Level without windscreen",
      unit: "dB",
    },
  ],
  outputs: [
    {
      id: "frequencyHertz",
      kind: "number",
      label: "Frequency",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "insertionLossDecibels",
      kind: "number",
      label: "Insertion loss",
      unit: "dB",
    },
  ],
  title: "Windscreen Insertion Loss",
});

export const run = tool.execute;
export default tool;
