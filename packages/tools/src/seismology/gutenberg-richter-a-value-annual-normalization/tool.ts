import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const gutenbergRichterAValueAnnualNormalizationExample = {
  input: { annualCountAtMc: 100, completenessMc: 2, bValue: 1 },
  output: { aValueLog10: 4, expectedAnnualAtM5: 0.1 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const gutenbergRichterAValueAnnualNormalizationTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ annualCountAtMc, completenessMc, bValue }) => {
      if (annualCountAtMc <= 0)
        simpleError("annualCountAtMc", "Annual event count must be positive.");
      return {
        aValueLog10: Math.log10(annualCountAtMc) + bValue * completenessMc,
        expectedAnnualAtM5: Math.pow(
          10,
          Math.log10(annualCountAtMc) + bValue * (completenessMc - 5),
        ),
      };
    })(input as never) as Record<string, unknown>,
  description: "Annualized GR productivity: a = log₁₀(N_year) + b·Mc.",
  id: "seismology/gutenberg-richter-a-value-annual-normalization",
  inputs: [
    {
      minimum: 0,
      description: "Events per year above Mc.",
      id: "annualCountAtMc",
      kind: "number",
      label: "N_yr",
    },
    {
      description: "Completeness magnitude.",
      id: "completenessMc",
      kind: "number",
      label: "Mc",
    },
    {
      minimum: 0,
      description: "GR b-value.",
      id: "bValue",
      kind: "number",
      label: "b",
    },
  ],
  outputs: [
    {
      description: "Annual a-value (log10 count at M=0).",
      id: "aValueLog10",
      kind: "number",
      label: "a",
    },
    {
      description: "Predicted events per year at or above M5.",
      id: "expectedAnnualAtM5",
      kind: "number",
      label: "N(M≥5)",
    },
  ],
  title: "Gutenberg Richter A Value Annual Normalization",
});
export const runGutenbergRichterAValueAnnualNormalization =
  gutenbergRichterAValueAnnualNormalizationTool.execute;
export { gutenbergRichterAValueAnnualNormalizationExample as example };
export default gutenbergRichterAValueAnnualNormalizationTool;
