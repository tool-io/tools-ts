import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly firstReplicate: readonly number[];
  readonly secondReplicate: readonly number[];
  readonly minimumCorrelation: number;
}>;
export type Output = Readonly<{
  readonly pearsonCorrelation: number;
  readonly meanAbsoluteDifference: number;
  readonly passesGate: boolean;
}>;

export const calculate = (input: Input): Output => {
  const n = input.firstReplicate.length;
  if (n < 2 || input.secondReplicate.length !== n)
    simpleError(
      "firstReplicate",
      "Aligned replicates need at least two values.",
      "invalid_replicates",
    );
  const ma = input.firstReplicate.reduce((a, b) => a + b, 0) / n,
    mb = input.secondReplicate.reduce((a, b) => a + b, 0) / n;
  let cov = 0,
    va = 0,
    vb = 0;
  for (let i = 0; i < n; i += 1) {
    const a = input.firstReplicate[i] - ma,
      b = input.secondReplicate[i] - mb;
    cov += a * b;
    va += a * a;
    vb += b * b;
  }
  if (va === 0 || vb === 0)
    simpleError(
      "firstReplicate",
      "Replicates need variation.",
      "zero_variance",
    );
  const pearsonCorrelation = cov / Math.sqrt(va * vb);
  return {
    pearsonCorrelation,
    meanAbsoluteDifference:
      input.firstReplicate.reduce(
        (sum, value, index) =>
          sum + Math.abs(value - input.secondReplicate[index]),
        0,
      ) / n,
    passesGate: pearsonCorrelation >= input.minimumCorrelation,
  };
};

export const exampleInput = {
  firstReplicate: [1, 2, 3],
  secondReplicate: [2, 4, 6],
  minimumCorrelation: 0.9,
} satisfies Input;
export const exampleOutput = {
  pearsonCorrelation: 1,
  meanAbsoluteDifference: 2,
  passesGate: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      firstReplicate: input.firstReplicate as readonly number[],
      secondReplicate: input.secondReplicate as readonly number[],
      minimumCorrelation: input.minimumCorrelation as number,
    }),
  description:
    "Calculate biological-replicate Pearson concordance and gate status.",
  id: "epigenetics/replicate-concordance",
  inputs: [
    {
      id: "firstReplicate",
      label: "First replicate values",
      kind: "numberList",
    },
    {
      id: "secondReplicate",
      label: "Second replicate values",
      kind: "numberList",
    },
    {
      id: "minimumCorrelation",
      label: "Minimum Pearson correlation",
      kind: "number",
      minimum: -1,
      maximum: 1,
    },
  ],
  outputs: [
    {
      id: "pearsonCorrelation",
      label: "Pearson correlation",
      kind: "number",
      minimum: -1,
      maximum: 1,
    },
    {
      id: "meanAbsoluteDifference",
      label: "Mean absolute difference",
      kind: "number",
      minimum: 0,
    },
    {
      id: "passesGate",
      label: "Passes supplied concordance gate",
      kind: "boolean",
    },
  ],
  title: "Replicate Concordance",
});

export const run = tool.execute;
export default tool;
