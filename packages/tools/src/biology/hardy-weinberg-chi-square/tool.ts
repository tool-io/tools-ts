import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HardyWeinbergChiSquareInput = {
  readonly alleleFrequencyP: number;
  readonly observedHeterozygous: number;
  readonly observedHomoDominant: number;
  readonly observedHomoRecessive: number;
};

export type HardyWeinbergChiSquareOutput = {
  readonly chiSquare: number;
};

export const hardyWeinbergChiSquareExample = {
  input: {
    alleleFrequencyP: 0.5,
    observedHomoDominant: 45,
    observedHeterozygous: 50,
    observedHomoRecessive: 5,
  },
  output: { chiSquare: 32 },
} satisfies ToolExample<
  HardyWeinbergChiSquareInput,
  HardyWeinbergChiSquareOutput
>;

export const hardyWeinbergChiSquareTool = createSimpleTool({
  id: "biology/hardy-weinberg-chi-square",
  title: "HW Chi-Square",
  description:
    "Compute a chi-square statistic comparing observed genotype counts against Hardy-Weinberg expectations derived from an allele frequency.",
  inputs: [
    {
      id: "observedHomoDominant",
      label: "Observed AA",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "observedHeterozygous",
      label: "Observed Aa",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "observedHomoRecessive",
      label: "Observed aa",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "alleleFrequencyP",
      label: "Allele frequency p",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [{ id: "chiSquare", label: "Chi-square", kind: "number" }],
  calculate: (input) => {
    const p = input.alleleFrequencyP as number;
    if (!(p > 0 && p < 1))
      simpleError(
        "alleleFrequencyP",
        "Allele frequency must be strictly between zero and one so every expected genotype count is positive.",
        "degenerate_frequency",
      );
    const q = 1 - p;
    const total =
      (input.observedHomoDominant as number) +
      (input.observedHeterozygous as number) +
      (input.observedHomoRecessive as number);
    if (!(total > 0))
      simpleError("observedHeterozygous", "Total must be positive.");
    const expecteds = [total * p * p, 2 * total * p * q, total * q * q];
    const observed = [
      input.observedHomoDominant,
      input.observedHeterozygous,
      input.observedHomoRecessive,
    ] as const;
    let chiSquare = 0;
    for (let index = 0; index < 3; index += 1)
      chiSquare +=
        ((observed[index] as number) - expecteds[index]!) ** 2 /
        expecteds[index]!;
    return { chiSquare };
  },
});
export const runHardyWeinbergChiSquare = hardyWeinbergChiSquareTool.execute;
export default hardyWeinbergChiSquareTool;
