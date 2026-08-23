import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SyntheticDivisionInput = {
  readonly dividendCoefficients?: readonly number[];
  readonly divisorRoot?: number;
};

export type SyntheticDivisionOutput = {
  readonly quotientCoefficients: readonly number[];
  readonly remainder: number;
};

export const calculateSyntheticDivision = (
  input: SyntheticDivisionInput,
): SyntheticDivisionOutput => {
  const coefficients = input.dividendCoefficients ?? [1, -6, 11, -6];
  const root = input.divisorRoot ?? 2;
  if (coefficients.length === 0)
    return simpleError(
      "dividendCoefficients",
      "At least one coefficient is required (highest degree first).",
      "invalid_polynomial",
    );
  const quotientCoefficients: number[] = [];
  let carry = coefficients[0];
  for (let index = 1; index < coefficients.length; index += 1) {
    quotientCoefficients.push(carry);
    carry = coefficients[index] + root * carry;
    if (!Number.isFinite(carry))
      return simpleError(
        index === coefficients.length - 1
          ? "remainder"
          : "quotientCoefficients",
        "The division result is outside the finite numeric range.",
        "result_not_finite",
      );
  }
  const remainder = carry;
  return { quotientCoefficients, remainder };
};

export const syntheticDivisionExample = {
  input: {
    dividendCoefficients: [1, -6, 11, -6],
    divisorRoot: 2,
  },
  output: {
    quotientCoefficients: [1, -4, 3],
    remainder: 0,
  },
} satisfies ToolExample<SyntheticDivisionInput, SyntheticDivisionOutput>;

export const syntheticDivisionTool = createSimpleTool({
  id: "algebra/synthetic-division",
  title: "Synthetic Division Calculator",
  description:
    "Divide a polynomial (highest-degree-first coefficients) by (x - r) using synthetic division, returning the quotient and remainder.",
  inputs: [
    {
      default: [1, -6, 11, -6],
      description:
        "Dividend coefficients from highest degree to constant term.",
      id: "dividendCoefficients",
      kind: "numberList",
      label: "Dividend coefficients",
    },
    {
      default: 2,
      description: "Root r of the linear divisor (x - r).",
      id: "divisorRoot",
      kind: "number",
      label: "Divisor root",
    },
  ],
  outputs: [
    {
      description:
        "Quotient coefficients from highest degree to constant term.",
      id: "quotientCoefficients",
      kind: "numberList",
      label: "Quotient coefficients",
    },
    {
      description: "Remainder of the division.",
      id: "remainder",
      kind: "number",
      label: "Remainder",
    },
  ],
  calculate: (input) =>
    calculateSyntheticDivision(input as SyntheticDivisionInput),
});

export const runSyntheticDivision = syntheticDivisionTool.execute;
export default syntheticDivisionTool;
