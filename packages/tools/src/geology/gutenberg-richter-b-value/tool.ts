import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GutenbergRichterBValueInput = {
  readonly meanMagnitude: number;
  readonly completenessMagnitude: number;
};

export type GutenbergRichterBValueOutput = {
  readonly bValue: number;
};

export const calculateGutenbergRichterBValue = (
  input: GutenbergRichterBValueInput,
): GutenbergRichterBValueOutput => {
  const delta = input.meanMagnitude - input.completenessMagnitude;
  if (!(delta > 0))
    simpleError(
      "meanMagnitude",
      "Mean magnitude must exceed the completeness magnitude for the Aki estimator.",
      "invalid_magnitudes",
    );
  return { bValue: Math.LOG10E / delta };
};

export const gutenbergRichterBValueExample = {
  input: { meanMagnitude: 2.5, completenessMagnitude: 2 },
  output: { bValue: 0.8685889638065036 },
} satisfies ToolExample<
  GutenbergRichterBValueInput,
  GutenbergRichterBValueOutput
>;

export const gutenbergRichterBValueTool = createSimpleTool({
  id: "geology/gutenberg-richter-b-value",
  title: "Gutenberg Richter B Value Calculator",
  description:
    "Aki (1965) maximum-likelihood b value of the Gutenberg-Richter law log10 N = a - bM: b = log10(e) / (mean magnitude - completeness magnitude).",
  inputs: [
    {
      description: "Mean magnitude of the catalog above completeness.",
      id: "meanMagnitude",
      kind: "number",
      label: "Mean magnitude",
    },
    {
      description: "Completeness (minimum) magnitude of the catalog.",
      id: "completenessMagnitude",
      kind: "number",
      label: "Completeness",
    },
  ],
  outputs: [
    {
      description: "Gutenberg-Richter b value (dimensionless).",
      id: "bValue",
      kind: "number",
      label: "b value",
    },
  ],
  calculate: (input) =>
    calculateGutenbergRichterBValue(
      input as unknown as GutenbergRichterBValueInput,
    ),
});

export const runGutenbergRichterBValue = gutenbergRichterBValueTool.execute;
export default gutenbergRichterBValueTool;
