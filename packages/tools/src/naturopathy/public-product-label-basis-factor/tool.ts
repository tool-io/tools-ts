import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedAmount: number;
  readonly sourceBasis: number;
  readonly targetBasis: number;
};
export type Output = { readonly targetBasisAmount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedAmount: { type: "number" },
    sourceBasis: { type: "number", exclusiveMinimum: 0 },
    targetBasis: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["reportedAmount", "sourceBasis", "targetBasis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { targetBasisAmount: { type: "number" } },
  required: ["targetBasisAmount"],
} as const;
/** Rescale explicitly supplied public label quantities without safety, efficacy or dosing advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedAmount, sourceBasis, targetBasis } = request;
  const compute = (): Output => {
    H.positive(sourceBasis);
    H.positive(targetBasis);
    return { targetBasisAmount: (reportedAmount / sourceBasis) * targetBasis };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reportedAmount: 20, sourceBasis: 100, targetBasis: 25 },
  output: { targetBasisAmount: 5 },
} satisfies ToolExample<Input, Output>;
export const publicProductLabelBasisFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "naturopathy/public-product-label-basis-factor",
    title: "Public Product Label Basis Factor Tool",
    description:
      "Rescale explicitly supplied public label quantities without safety, efficacy or dosing advice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedAmount: { type: "number" },
        sourceBasis: { type: "number", exclusiveMinimum: 0 },
        targetBasis: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["reportedAmount", "sourceBasis", "targetBasis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { targetBasisAmount: { type: "number" } },
      required: ["targetBasisAmount"],
    },
    ports: {
      inputs: [
        {
          id: "reportedAmount",
          label: "Reported Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceBasis",
          label: "Source Basis",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetBasis",
          label: "Target Basis",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "targetBasisAmount",
          label: "Target Basis Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicProductLabelBasisFactorTool.execute;
export default publicProductLabelBasisFactorTool;
