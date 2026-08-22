import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const FractionToDecimalTool = createSimpleTool({
  id: "arithmetic/fraction-to-decimal",
  title: "Fraction to Decimal Converter",
  description: "Convert a fraction numerator/denominator to decimal form.",
  inputs: [
    { id: "numerator", label: "Numerator", kind: "integer" },
    { id: "denominator", label: "Denominator", kind: "integer" },
  ],
  outputs: [{ id: "decimal", label: "Decimal value", kind: "number" }],
  calculate: (input) => {
    const d = input.denominator as number;
    if (d === 0)
      simpleError("denominator", "Cannot be zero.", "invalid_denominator");
    return { decimal: (input.numerator as number) / d };
  },
});
export default FractionToDecimalTool;
export const runFractionToDecimal = FractionToDecimalTool.execute;

export type FractionToDecimalInput = {
  readonly numerator: number;
  readonly denominator: number;
};

export type FractionToDecimalOutput = {
  readonly decimal: number;
};

export const fractionToDecimalExample = {
  input: {
    numerator: 1,
    denominator: 1,
  },
  output: {
    decimal: 1,
  },
} satisfies ToolExample<FractionToDecimalInput, FractionToDecimalOutput>;
