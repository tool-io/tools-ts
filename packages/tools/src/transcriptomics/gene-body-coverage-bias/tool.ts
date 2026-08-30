import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly fivePrimeReadCounts: readonly number[];
  readonly threePrimeReadCounts: readonly number[];
  readonly maximumAbsoluteLog2Bias: number;
}>;
export type Output = Readonly<{
  readonly fivePrimeTotal: number;
  readonly threePrimeTotal: number;
  readonly log2ThreeToFiveBias: number;
  readonly degraded: boolean;
}>;

export const calculate = (input: Input): Output => {
  const a = input.fivePrimeReadCounts.reduce((x, y) => x + y, 0),
    b = input.threePrimeReadCounts.reduce((x, y) => x + y, 0);
  if (
    input.fivePrimeReadCounts.length === 0 ||
    input.threePrimeReadCounts.length === 0 ||
    a <= 0 ||
    b <= 0
  )
    simpleError(
      "fivePrimeReadCounts",
      "Positive read coverage is required at both gene ends.",
    );
  const log2ThreeToFiveBias = Math.log2(b / a);
  return {
    fivePrimeTotal: a,
    threePrimeTotal: b,
    log2ThreeToFiveBias,
    degraded: log2ThreeToFiveBias >= input.maximumAbsoluteLog2Bias,
  };
};

export const exampleInput = {
  fivePrimeReadCounts: [10, 10],
  threePrimeReadCounts: [20, 20],
  maximumAbsoluteLog2Bias: 0.5,
} satisfies Input;
export const exampleOutput = {
  fivePrimeTotal: 20,
  threePrimeTotal: 40,
  log2ThreeToFiveBias: 1,
  degraded: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/gene-body-coverage-bias",
  title: "Gene Body Coverage Bias",
  description:
    "Detect 3-prime RNA coverage bias from aggregated end-of-gene read depth.",
  inputs: [
    {
      id: "fivePrimeReadCounts",
      kind: "numberList",
      label: "Five prime read counts",
    },
    {
      id: "threePrimeReadCounts",
      kind: "numberList",
      label: "Three prime read counts",
    },
    {
      id: "maximumAbsoluteLog2Bias",
      kind: "number",
      label: "Maximum absolute log 2 bias",
    },
  ],
  outputs: [
    { id: "fivePrimeTotal", kind: "number", label: "Five prime total" },
    { id: "threePrimeTotal", kind: "number", label: "Three prime total" },
    {
      id: "log2ThreeToFiveBias",
      kind: "number",
      label: "Log 2 three to five bias",
    },
    { id: "degraded", kind: "boolean", label: "Degraded" },
  ],
  calculate: (value) =>
    calculate({
      fivePrimeReadCounts: value.fivePrimeReadCounts as readonly number[],
      threePrimeReadCounts: value.threePrimeReadCounts as readonly number[],
      maximumAbsoluteLog2Bias: value.maximumAbsoluteLog2Bias as number,
    }),
});
export const run = tool.execute;
export default tool;
