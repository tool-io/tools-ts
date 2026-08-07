import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { sampleRandomSource, type RandomSource } from "../number/tool.js";
export const calculateRandomItem = <T>(
  values: readonly T[],
  random: RandomSource = Math.random,
): T | null => {
  const sample = sampleRandomSource(random);
  return sample === null || !values.length
    ? null
    : (values[Math.floor(sample * values.length)] ?? null);
};
export const randomItemExample = {
  input: { values: ["Pizza", "Sushi", "Tacos"] },
} satisfies ToolExample<{ readonly values: readonly string[] }>;
export const randomItemTool = createSimpleTool({
  id: "random/item",
  title: "Random Item Picker",
  description: "Choose one random value from a nonempty list.",
  inputs: [{ id: "values", kind: "stringList", label: "Items" }],
  outputs: [
    {
      format: "random/item",
      id: "value",
      kind: "string",
      label: "Random item",
    },
  ],
  calculate: (input, context) => {
    const value = calculateRandomItem(
      input.values as string[],
      context.random ?? Math.random,
    );
    if (value === null)
      return simpleError("values", "Enter at least one item.");
    return { value };
  },
});
export const runRandomItem = randomItemTool.execute;
export default randomItemTool;
