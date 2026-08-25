import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const encephalizationQuotientExample = {
  input: { actualBrainGrams: 1400, bodyMassKg: 70 },
  output: { encephalizationQuotient: 4.941521261922714 },
} satisfies ToolExample<
  { readonly actualBrainGrams: number; readonly bodyMassKg: number },
  { readonly encephalizationQuotient: number }
>;

export const encephalizationQuotientTool = createSimpleTool({
  id: "biology/encephalization-quotient",
  title: "Encephalization Quotient",
  description:
    "Compare observed brain mass to the expected mass for a body size using primate reference constants: EQ = actualBrainGrams / (11.22 x bodyMassKg^0.76), where 11.22 is the reference intercept in grams and 0.76 the reference exponent.",
  inputs: [
    {
      description: "Observed brain mass in grams; must be greater than zero.",
      id: "actualBrainGrams",
      label: "Actual brain mass",
      kind: "number",
      unit: "g",
    },
    {
      description: "Body mass in kilograms; must be greater than zero.",
      id: "bodyMassKg",
      label: "Body mass",
      kind: "number",
      unit: "kg",
    },
  ],
  outputs: [
    {
      description: "Encephalization quotient relative to the primate line.",
      id: "encephalizationQuotient",
      label: "Encephalization quotient",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const actualBrainGrams = input.actualBrainGrams as number;
    const bodyMassKg = input.bodyMassKg as number;
    if (!(actualBrainGrams > 0))
      simpleError(
        "actualBrainGrams",
        "The brain mass must be greater than zero.",
      );
    if (!(bodyMassKg > 0))
      simpleError("bodyMassKg", "The body mass must be greater than zero.");
    return {
      encephalizationQuotient:
        actualBrainGrams / (11.22 * Math.pow(bodyMassKg, 0.76)),
    };
  },
});
export const runEncephalizationQuotient = encephalizationQuotientTool.execute;
export default encephalizationQuotientTool;
