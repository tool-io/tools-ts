import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly annualTransactionCount: number;
  readonly annualTransactionValue: number;
  readonly materiality: number;
  readonly complexProcessing: boolean;
  readonly significantJudgment: boolean;
  readonly selectionScoreThreshold: number;
}>;
export type Output = Readonly<{
  readonly valueToMateriality: number;
  readonly selectionScore: number;
  readonly significantClass: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.materiality <= 0)
    simpleError(
      "materiality",
      "Materiality must be positive.",
      "invalid_materiality",
    );
  const valueToMateriality = input.annualTransactionValue / input.materiality,
    selectionScore =
      (input.annualTransactionCount >= 1000 ? 1 : 0) +
      (valueToMateriality >= 1 ? 2 : 0) +
      (input.complexProcessing ? 2 : 0) +
      (input.significantJudgment ? 2 : 0);
  return {
    valueToMateriality,
    selectionScore,
    significantClass: selectionScore >= input.selectionScoreThreshold,
  };
};

export const exampleInput = {
  annualTransactionCount: 2000,
  annualTransactionValue: 200000,
  materiality: 100000,
  complexProcessing: true,
  significantJudgment: false,
  selectionScoreThreshold: 5,
} satisfies Input;
export const exampleOutput = {
  valueToMateriality: 2,
  selectionScore: 5,
  significantClass: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      annualTransactionCount: input.annualTransactionCount as number,
      annualTransactionValue: input.annualTransactionValue as number,
      materiality: input.materiality as number,
      complexProcessing: input.complexProcessing as boolean,
      significantJudgment: input.significantJudgment as boolean,
      selectionScoreThreshold: input.selectionScoreThreshold as number,
    }),
  description: "Score a transaction class for audit significance.",
  id: "auditing/significant-transaction-class",
  inputs: [
    {
      id: "annualTransactionCount",
      label: "Annual transaction count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "annualTransactionValue",
      label: "Annual transaction value",
      kind: "number",
      minimum: 0,
    },
    { id: "materiality", label: "Materiality", kind: "number", minimum: 0 },
    { id: "complexProcessing", label: "Complex processing", kind: "boolean" },
    {
      id: "significantJudgment",
      label: "Significant judgment",
      kind: "boolean",
    },
    {
      id: "selectionScoreThreshold",
      label: "Selection score threshold",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "valueToMateriality",
      label: "Annual value to materiality",
      kind: "number",
      minimum: 0,
    },
    {
      id: "selectionScore",
      label: "Transaction-class selection score",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "significantClass",
      label: "Meets supplied significance threshold",
      kind: "boolean",
    },
  ],
  title: "Significant Transaction Class",
});

export const run = tool.execute;
export default tool;
