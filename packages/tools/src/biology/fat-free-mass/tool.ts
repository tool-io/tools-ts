import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const fatFreeMassExample = {
  input: { bodyFatPercent: 20, bodyWeightKg: 80 },
} satisfies ToolExample<{
  readonly bodyFatPercent: number;
  readonly bodyWeightKg: number;
}>;

export const fatFreeMassTool = createSimpleTool({
  id: "biology/fat-free-mass",
  title: "Fat Free Mass",
  description:
    "Compute fat-free body mass in kilograms from body weight and body fat percentage.",
  inputs: [
    { id: "bodyWeightKg", label: "Body weight kg", kind: "number" },
    {
      id: "bodyFatPercent",
      label: "Body fat percent",
      kind: "number",
      maximum: 100,
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "fatFreeMassKg",
      label: "Fat free mass kg",
      kind: "number",
      unit: "kg",
    },
  ],
  calculate: (input) => {
    const bodyWeightKg = input.bodyWeightKg as number;
    const bodyFatPercent = input.bodyFatPercent as number;
    if (bodyWeightKg <= 0)
      simpleError("bodyWeightKg", "Body weight must be greater than zero.");
    return {
      fatFreeMassKg: bodyWeightKg * (1 - bodyFatPercent / 100),
    };
  },
});
export const runFatFreeMass = fatFreeMassTool.execute;
export default fatFreeMassTool;
