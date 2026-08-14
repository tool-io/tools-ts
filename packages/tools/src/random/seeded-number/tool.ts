import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RandomSource = () => number;

export const createSeededRandom = (seed: string): RandomSource => {
  let state = 2_166_136_261;
  for (let index = 0; index < seed.length; index += 1) {
    state ^= seed.charCodeAt(index);
    state = Math.imul(state, 16_777_619);
  }
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
};

export const calculateSeededRandomNumbers = (
  seed: string,
  count: number,
): number[] | null => {
  if (
    !seed.trim() ||
    !Number.isSafeInteger(count) ||
    count < 1 ||
    count > 100_000
  )
    return null;
  const random = createSeededRandom(seed);
  return Array.from({ length: count }, random);
};

export const seededNumberExample = {
  input: { count: 3, seed: "tool.io" },
  output: {
    values: [0.15426546288654208, 0.6839655067306012, 0.25519106397405267],
  },
} satisfies ToolExample<
  { readonly count: number; readonly seed: string },
  { readonly values: readonly number[] }
>;

export const seededNumberTool = createSimpleTool({
  id: "random/seeded-number",
  title: "Seeded Random Number Generator",
  description:
    "Generate a reproducible sequence of decimal values from zero inclusive to one exclusive.",
  inputs: [
    { id: "seed", kind: "string", label: "Seed" },
    {
      id: "count",
      kind: "integer",
      label: "Count",
      maximum: 100_000,
      minimum: 1,
    },
  ],
  outputs: [
    {
      format: "random/uniform-01",
      id: "values",
      kind: "numberList",
      label: "Seeded random numbers",
    },
  ],
  calculate: (input) => {
    const values = calculateSeededRandomNumbers(
      input.seed as string,
      input.count as number,
    );
    if (!values) return simpleError("seed", "Enter a nonempty seed.");
    return { values };
  },
});

export const runSeededNumber = seededNumberTool.execute;
export default seededNumberTool;
