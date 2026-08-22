import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const cohensDExample = {
  input: { mean1: 5, n1: 30, n2: 30, sd1: 2, sd2: 2, mean2: 3 },
  output: { cohensD: 1 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const calculateCohensD = (input: CohensDInput): CohensDOutput => {
  const pooledSd = Math.sqrt(
    ((input.n1 - 1) * input.sd1 ** 2 + (input.n2 - 1) * input.sd2 ** 2) /
      (input.n1 + input.n2 - 2),
  );
  if (pooledSd <= 0)
    simpleError(
      "sd1",
      "The pooled standard deviation must be positive.",
      "invalid_sd",
    );
  return {
    cohensD: Number(((input.mean1 - input.mean2) / pooledSd).toPrecision(12)),
  };
};

export type CohensDInput = {
  readonly mean1: number;
  readonly mean2: number;
  readonly n1: number;
  readonly n2: number;
  readonly sd1: number;
  readonly sd2: number;
};
export type CohensDOutput = { readonly cohensD: number };

export const cohensDTool = createSimpleTool({
  calculate: (input) => calculateCohensD(input as unknown as CohensDInput),
  description:
    "Compute Cohen's d effect size between two independent samples using pooled standard deviation.",
  id: "statistics/cohens-d",
  inputs: [
    { id: "mean1", kind: "number", label: "Mean 1" },
    { id: "mean2", kind: "number", label: "Mean 2" },
    { id: "n1", kind: "integer", label: "N 1", minimum: 2 },
    { id: "n2", kind: "integer", label: "N 2", minimum: 2 },
    { id: "sd1", kind: "number", label: "SD 1", minimum: 0 },
    { id: "sd2", kind: "number", label: "SD 2", minimum: 0 },
  ],
  outputs: [{ id: "cohensD", kind: "number", label: "Cohen's d" }],
  title: "Cohen's D Calculator",
});
export const runCohensD = cohensDTool.execute;
export default cohensDTool;
