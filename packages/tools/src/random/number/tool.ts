import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RandomSource = () => number;
export const sampleRandomSource = (random: RandomSource): number | null => {
  const value = random();
  return Number.isFinite(value) && value >= 0 && value < 1 ? value : null;
};
export const calculateRandomInteger = (
  minimum: number,
  maximum: number,
  random: RandomSource = Math.random,
): number | null => {
  if (
    !Number.isSafeInteger(minimum) ||
    !Number.isSafeInteger(maximum) ||
    minimum > maximum ||
    !Number.isSafeInteger(maximum - minimum + 1)
  )
    return null;

  const sample = sampleRandomSource(random);
  return sample === null
    ? null
    : minimum + Math.floor(sample * (maximum - minimum + 1));
};
export const randomNumberExample = {
  input: { maximum: 100, minimum: 1 },
} satisfies ToolExample<{ readonly maximum: number; readonly minimum: number }>;
export const randomNumberTool = createSimpleTool({
  id: "random/number",
  title: "Random Number Generator",
  description: "Generate a random integer within an inclusive range.",
  inputs: [
    { id: "minimum", kind: "integer", label: "Minimum" },
    { id: "maximum", kind: "integer", label: "Maximum" },
  ],
  outputs: [
    {
      format: "random/integer",
      id: "value",
      kind: "integer",
      label: "Random number",
    },
  ],
  calculate: (input, context) => {
    const value = calculateRandomInteger(
      input.minimum as number,
      input.maximum as number,
      context.random ?? Math.random,
    );
    if (value === null)
      return simpleError(
        "maximum",
        "Maximum must be at least minimum and the inclusive range must be safe.",
      );
    return { value };
  },
});
export const runRandomNumber = randomNumberTool.execute;
export default randomNumberTool;
