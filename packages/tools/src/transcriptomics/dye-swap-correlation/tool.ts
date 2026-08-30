import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly forwardLogRatios: readonly number[];
  readonly reverseLogRatios: readonly number[];
  readonly minimumCorrelation: number;
}>;
export type Output = Readonly<{
  readonly correlation: number;
  readonly concordant: boolean;
}>;

export const calculate = (input: Input): Output => {
  const a = input.forwardLogRatios,
    b = input.reverseLogRatios,
    n = a.length;
  if (n < 2 || b.length !== n)
    simpleError(
      "forwardLogRatios",
      "Aligned replicate ratios require at least two spots.",
    );
  const ma = a.reduce((s, v) => s + v, 0) / n,
    mb = b.reduce((s, v) => s + v, 0) / n,
    cov = a.reduce((s, v, i) => s + (v - ma) * (-b[i] + mb), 0),
    va = a.reduce((s, v) => s + (v - ma) ** 2, 0),
    vb = b.reduce((s, v) => s + (v - mb) ** 2, 0);
  if (va === 0 || vb === 0)
    simpleError("forwardLogRatios", "Replicates must vary.");
  const correlation = cov / Math.sqrt(va * vb);
  return { correlation, concordant: correlation >= input.minimumCorrelation };
};

export const exampleInput = {
  forwardLogRatios: [1, 2, 3],
  reverseLogRatios: [-1, -2, -3],
  minimumCorrelation: 0.8,
} satisfies Input;
export const exampleOutput = {
  correlation: 1,
  concordant: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/dye-swap-correlation",
  title: "Dye Swap Correlation",
  description:
    "Correlate forward dye ratios with sign-reversed dye-swap replicates.",
  inputs: [
    { id: "forwardLogRatios", kind: "numberList", label: "Forward log ratios" },
    { id: "reverseLogRatios", kind: "numberList", label: "Reverse log ratios" },
    { id: "minimumCorrelation", kind: "number", label: "Minimum correlation" },
  ],
  outputs: [
    { id: "correlation", kind: "number", label: "Correlation" },
    { id: "concordant", kind: "boolean", label: "Concordant" },
  ],
  calculate: (value) =>
    calculate({
      forwardLogRatios: value.forwardLogRatios as readonly number[],
      reverseLogRatios: value.reverseLogRatios as readonly number[],
      minimumCorrelation: value.minimumCorrelation as number,
    }),
});
export const run = tool.execute;
export default tool;
