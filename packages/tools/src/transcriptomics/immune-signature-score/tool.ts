import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly signatureZScores: readonly number[];
  readonly minimumMeanZ: number;
}>;
export type Output = Readonly<{
  readonly meanSignatureZ: number;
  readonly passes: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.signatureZScores.length === 0)
    simpleError(
      "signatureZScores",
      "At least one signature z-score is required.",
    );
  const meanSignatureZ =
    input.signatureZScores.reduce((a, b) => a + b, 0) /
    input.signatureZScores.length;
  return { meanSignatureZ, passes: meanSignatureZ >= input.minimumMeanZ };
};

export const exampleInput = {
  signatureZScores: [1, 2, -1],
  minimumMeanZ: 0.5,
} satisfies Input;
export const exampleOutput = {
  meanSignatureZ: 0.6666666666666666,
  passes: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/immune-signature-score",
  title: "Immune Signature Score",
  description:
    "Score immune-cell signature enrichment from standardized gene expression.",
  inputs: [
    { id: "signatureZScores", kind: "numberList", label: "Signature z scores" },
    { id: "minimumMeanZ", kind: "number", label: "Minimum mean z" },
  ],
  outputs: [
    { id: "meanSignatureZ", kind: "number", label: "Mean signature z" },
    { id: "passes", kind: "boolean", label: "Passes" },
  ],
  calculate: (value) =>
    calculate({
      signatureZScores: value.signatureZScores as readonly number[],
      minimumMeanZ: value.minimumMeanZ as number,
    }),
});
export const run = tool.execute;
export default tool;
