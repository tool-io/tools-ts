import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { fraction, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly variantIds: readonly string[];
  readonly infoScores: readonly number[];
  readonly minimumInfoScore: number;
}>;
export type Output = Readonly<{
  readonly retainedVariants: readonly string[];
  readonly rejectedVariants: readonly string[];
  readonly retainedPercent: number;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.variantIds, input.infoScores, "variantIds");
  input.infoScores.forEach((v) => fraction(v, "infoScores"));
  fraction(input.minimumInfoScore, "minimumInfoScore");
  const retainedVariants = input.variantIds.filter(
    (_, i) => input.infoScores[i] >= input.minimumInfoScore,
  );
  return {
    retainedVariants,
    rejectedVariants: input.variantIds.filter(
      (_, i) => input.infoScores[i] < input.minimumInfoScore,
    ),
    retainedPercent: (100 * retainedVariants.length) / input.variantIds.length,
  };
};
export const exampleInput = {
  variantIds: ["A", "B"],
  infoScores: [0.9, 0.2],
  minimumInfoScore: 0.8,
} satisfies Input;
export const exampleOutput = {
  retainedVariants: ["A"],
  rejectedVariants: ["B"],
  retainedPercent: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/imputation-info-gate",
  title: "Imputation Info Gate",
  description: "Filter imputed variants by a caller-defined INFO-score floor.",
  inputs: [
    { id: "variantIds", label: "Variant ids", kind: "stringList" },
    { id: "infoScores", label: "Info scores", kind: "numberList" },
    { id: "minimumInfoScore", label: "Minimum info score", kind: "number" },
  ],
  outputs: [
    { id: "retainedVariants", label: "Retained variants", kind: "stringList" },
    { id: "rejectedVariants", label: "Rejected variants", kind: "stringList" },
    { id: "retainedPercent", label: "Retained percent", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      variantIds: value.variantIds as readonly string[],
      infoScores: value.infoScores as readonly number[],
      minimumInfoScore: value.minimumInfoScore as number,
    }),
});
export const run = tool.execute;
export default tool;
