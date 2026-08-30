import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly incrementX: readonly number[];
  readonly incrementY: readonly number[];
  readonly initialX: number;
  readonly initialY: number;
}>;
export type Output = Readonly<{
  readonly absoluteX: readonly number[];
  readonly absoluteY: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  if (input.incrementX.length !== input.incrementY.length)
    simpleError("incrementX", "Aligned dither increments required.");
  const absoluteX = [input.initialX],
    absoluteY = [input.initialY];
  input.incrementX.forEach((v, i) => {
    absoluteX.push(absoluteX[i] + v);
    absoluteY.push(absoluteY[i] + input.incrementY[i]);
  });
  if (absoluteX.length > 100000)
    simpleError(
      "incrementX",
      "Reconstructed offsets exceed the generated-value budget.",
    );
  return { absoluteX, absoluteY };
};
export const exampleInput = {
  incrementX: [1, -1],
  incrementY: [0, 2],
  initialX: 5,
  initialY: 3,
} satisfies Input;
export const exampleOutput = {
  absoluteX: [5, 6, 5],
  absoluteY: [3, 3, 5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/dither-offset-reconstruction",
  title: "Dither Offset Reconstruction",
  description:
    "Reconstruct absolute planar dither positions from relative offsets and an explicit initial position in a common unit.",
  inputs: [
    { id: "incrementX", label: "Increment x", kind: "numberList" },
    { id: "incrementY", label: "Increment y", kind: "numberList" },
    { id: "initialX", label: "Initial x", kind: "number" },
    { id: "initialY", label: "Initial y", kind: "number" },
  ],
  outputs: [
    { id: "absoluteX", label: "Absolute x", kind: "numberList" },
    { id: "absoluteY", label: "Absolute y", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      incrementX: value.incrementX as readonly number[],
      incrementY: value.incrementY as readonly number[],
      initialX: value.initialX as number,
      initialY: value.initialY as number,
    }),
});
export const run = tool.execute;
export default tool;
