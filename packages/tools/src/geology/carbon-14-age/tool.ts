import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Carbon14AgeInput = {
  readonly fractionModern: number;
  readonly halfLifeYears?: number;
};

export type Carbon14AgeOutput = {
  readonly ageYearsBP: number;
};

/**
 * Radiocarbon decay: t = -(T1/2 / ln 2) ln(F14C), with the Cambridge
 * (Libby-corrected) half-life of 5730 years by default.
 */
export const calculateCarbon14Age = (
  input: Carbon14AgeInput,
): Carbon14AgeOutput => {
  const halfLifeYears = input.halfLifeYears ?? 5730;
  if (!(input.fractionModern > 0))
    return simpleError(
      "fractionModern",
      "The fraction modern carbon must be greater than zero.",
      "invalid_fraction",
    );
  if (!(halfLifeYears > 0))
    return simpleError(
      "halfLifeYears",
      "The half-life must be greater than zero.",
      "invalid_half_life",
    );
  return {
    ageYearsBP: -(halfLifeYears / Math.LN2) * Math.log(input.fractionModern),
  };
};

export const carbon14AgeExample = {
  input: { fractionModern: 0.5, halfLifeYears: 5730 },
  output: { ageYearsBP: 5730 },
} satisfies ToolExample<Carbon14AgeInput, Carbon14AgeOutput>;

export const carbon14AgeTool = createSimpleTool({
  id: "geology/carbon-14-age",
  title: "Geology Carbon 14 Age Calculator",
  description:
    "Convert a fraction-modern C-14 measurement into a radiocarbon age in years BP.",
  inputs: [
    {
      description: "Fraction modern C-14 (F14C), e.g. 0.5 for one half-life.",
      id: "fractionModern",
      kind: "number",
      label: "Fraction modern",
      minimum: 0,
    },
    {
      default: 5730,
      description: "C-14 half-life in years.",
      id: "halfLifeYears",
      kind: "number",
      label: "Half-life",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Radiocarbon age in years before present (BP).",
      id: "ageYearsBP",
      kind: "number",
      label: "Age (yr BP)",
    },
  ],
  calculate: (input) =>
    calculateCarbon14Age(input as unknown as Carbon14AgeInput),
});

export const runCarbon14Age = carbon14AgeTool.execute;
export default carbon14AgeTool;
