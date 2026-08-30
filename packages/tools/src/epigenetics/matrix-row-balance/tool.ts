import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly matrixRowSums: readonly number[];
  readonly maximumCvPercent: number;
}>;
export type Output = Readonly<{
  readonly meanRowSum: number;
  readonly rowSumCvPercent: number;
  readonly balanced: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.matrixRowSums.length === 0 ||
    input.matrixRowSums.some((v) => v < 0)
  )
    simpleError(
      "matrixRowSums",
      "Row sums must be nonempty and nonnegative.",
      "invalid_rows",
    );
  const meanRowSum =
    input.matrixRowSums.reduce((a, b) => a + b, 0) / input.matrixRowSums.length;
  if (meanRowSum <= 0)
    simpleError("matrixRowSums", "Mean row sum must be positive.", "zero_rows");
  const sd = Math.sqrt(
      input.matrixRowSums.reduce((sum, v) => sum + (v - meanRowSum) ** 2, 0) /
        input.matrixRowSums.length,
    ),
    rowSumCvPercent = (sd / meanRowSum) * 100;
  return {
    meanRowSum,
    rowSumCvPercent,
    balanced: rowSumCvPercent <= input.maximumCvPercent,
  };
};

export const exampleInput = {
  matrixRowSums: [90, 100, 110],
  maximumCvPercent: 10,
} satisfies Input;
export const exampleOutput = {
  meanRowSum: 100,
  rowSumCvPercent: 8.16496580927726,
  balanced: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      matrixRowSums: input.matrixRowSums as readonly number[],
      maximumCvPercent: input.maximumCvPercent as number,
    }),
  description: "Measure matrix row-sum balance by coefficient of variation.",
  id: "epigenetics/matrix-row-balance",
  inputs: [
    { id: "matrixRowSums", label: "Matrix row sums", kind: "numberList" },
    {
      id: "maximumCvPercent",
      label: "Maximum coefficient of variation",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "meanRowSum", label: "Mean row sum", kind: "number", minimum: 0 },
    {
      id: "rowSumCvPercent",
      label: "Row-sum coefficient of variation",
      kind: "number",
      minimum: 0,
    },
    { id: "balanced", label: "Within supplied CV limit", kind: "boolean" },
  ],
  title: "Matrix Row Balance",
});

export const run = tool.execute;
export default tool;
