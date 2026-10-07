import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly labeledProteinAmount: number;
  readonly totalProteinAmount: number;
};
export type Output = {
  readonly labeledFraction: number;
  readonly unlabeledAmount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    labeledProteinAmount: { type: "number", minimum: 0 },
    totalProteinAmount: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["labeledProteinAmount", "totalProteinAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    labeledFraction: { type: "number" },
    unlabeledAmount: { type: "number" },
  },
  required: ["labeledFraction", "unlabeledAmount"],
} as const;
/** Calculate a supplied labeled-protein fraction on an explicitly consistent amount basis without estimating labeling efficiency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { labeledProteinAmount, totalProteinAmount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(totalProteinAmount) && totalProteinAmount > 0,
      "totalProteinAmount",
    ),
      totalProteinAmount);
    H.domain(
      labeledProteinAmount >= 0 && labeledProteinAmount <= totalProteinAmount,
      "labeledProteinAmount",
    );
    return {
      labeledFraction: labeledProteinAmount / totalProteinAmount,
      unlabeledAmount: totalProteinAmount - labeledProteinAmount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { labeledProteinAmount: 3, totalProteinAmount: 12 },
  output: { labeledFraction: 0.25, unlabeledAmount: 9 },
} satisfies ToolExample<Input, Output>;
export const proteinFractionalLabelingInputTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biochemistry", "biology"],
      keywords: ["biochemistry", "biology"],
    },
    id: "biochemistry/protein-fractional-labeling-input",
    title: "Protein Fractional Labeling Input",
    description:
      "Calculate a supplied labeled-protein fraction on an explicitly consistent amount basis without estimating labeling efficiency.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        labeledProteinAmount: { type: "number", minimum: 0 },
        totalProteinAmount: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["labeledProteinAmount", "totalProteinAmount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        labeledFraction: { type: "number" },
        unlabeledAmount: { type: "number" },
      },
      required: ["labeledFraction", "unlabeledAmount"],
    },
    ports: {
      inputs: [
        {
          id: "labeledProteinAmount",
          label: "Labeled Protein Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalProteinAmount",
          label: "Total Protein Amount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "labeledFraction",
          label: "Labeled Fraction",
          valueType: { type: "number" },
        },
        {
          id: "unlabeledAmount",
          label: "Unlabeled Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = proteinFractionalLabelingInputTool.execute;
export default proteinFractionalLabelingInputTool;
