import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly cellFractions: readonly number[];
  readonly sumTolerance: number;
}>;
export type Output = Readonly<{
  readonly sum: number;
  readonly deviation: number;
  readonly valid: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.cellFractions.length === 0 ||
    input.cellFractions.some((v) => v < 0 || v > 1) ||
    input.sumTolerance < 0
  )
    simpleError("cellFractions", "Fractions must be within [0,1].");
  const sum = input.cellFractions.reduce((a, b) => a + b, 0),
    deviation = Math.abs(sum - 1);
  return { sum, deviation, valid: deviation <= input.sumTolerance };
};

export const exampleInput = {
  cellFractions: [0.2, 0.3, 0.5],
  sumTolerance: 0.001,
} satisfies Input;
export const exampleOutput = {
  sum: 1,
  deviation: 0,
  valid: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/cell-fraction-constraint",
  title: "Cell Fraction Constraint",
  description: "Check deconvolved cell fractions sum to one within tolerance.",
  inputs: [
    { id: "cellFractions", kind: "numberList", label: "Cell fractions" },
    { id: "sumTolerance", kind: "number", label: "Sum tolerance" },
  ],
  outputs: [
    { id: "sum", kind: "number", label: "Sum" },
    { id: "deviation", kind: "number", label: "Deviation" },
    { id: "valid", kind: "boolean", label: "Valid" },
  ],
  calculate: (value) =>
    calculate({
      cellFractions: value.cellFractions as readonly number[],
      sumTolerance: value.sumTolerance as number,
    }),
});
export const run = tool.execute;
export default tool;
