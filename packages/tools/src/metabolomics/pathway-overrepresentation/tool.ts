import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly populationSize: number;
  readonly pathwaySize: number;
  readonly selectedSize: number;
  readonly overlapSize: number;
}>;
export type Output = Readonly<{
  readonly expectedOverlap: number;
  readonly enrichmentFold: number;
  readonly upperTailP: number;
}>;
export const calculate = (input: Input): Output => {
  const N = input.populationSize,
    K = input.pathwaySize,
    n = input.selectedSize,
    k = input.overlapSize;
  if (
    ![N, K, n, k].every((v) => Number.isSafeInteger(v) && v >= 0) ||
    N <= 0 ||
    N > 100_000 ||
    K > N ||
    n > N ||
    k > Math.min(K, n) ||
    k < Math.max(0, n - (N - K)) ||
    K === 0 ||
    n === 0
  )
    simpleError(
      "overlapSize",
      "Feasible nonempty integer hypergeometric counts required.",
    );
  const logFactorial = [0];
  for (let i = 1; i <= N; i++)
    logFactorial.push(logFactorial[i - 1] + Math.log(i));
  const logChoose = (a: number, b: number) =>
    logFactorial[a] - logFactorial[b] - logFactorial[a - b];
  let upperTailP = 0;
  for (let x = k; x <= Math.min(K, n); x++)
    if (n - x <= N - K)
      upperTailP += Math.exp(
        logChoose(K, x) + logChoose(N - K, n - x) - logChoose(N, n),
      );
  return {
    expectedOverlap: (n * K) / N,
    enrichmentFold: k / ((n * K) / N),
    upperTailP: Math.min(1, upperTailP),
  };
};
export const exampleInput = {
  populationSize: 10,
  pathwaySize: 5,
  selectedSize: 2,
  overlapSize: 2,
} satisfies Input;
export const exampleOutput = {
  expectedOverlap: 1,
  enrichmentFold: 2,
  upperTailP: 0.22222222222222182,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/pathway-overrepresentation",
  title: "Pathway Overrepresentation",
  description:
    "Calculate hypergeometric pathway over-representation and upper-tail probability.",
  inputs: [
    { id: "populationSize", kind: "number", label: "Population size" },
    { id: "pathwaySize", kind: "number", label: "Pathway size" },
    { id: "selectedSize", kind: "number", label: "Selected size" },
    { id: "overlapSize", kind: "number", label: "Overlap size" },
  ],
  outputs: [
    { id: "expectedOverlap", kind: "number", label: "Expected overlap" },
    { id: "enrichmentFold", kind: "number", label: "Enrichment fold" },
    { id: "upperTailP", kind: "number", label: "Upper tail p" },
  ],
  calculate: (value) =>
    calculate({
      populationSize: value.populationSize as number,
      pathwaySize: value.pathwaySize as number,
      selectedSize: value.selectedSize as number,
      overlapSize: value.overlapSize as number,
    }),
});
export const run = tool.execute;
export default tool;
