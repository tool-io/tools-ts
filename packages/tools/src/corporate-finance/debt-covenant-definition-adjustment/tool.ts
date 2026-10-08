import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedMetric: number;
  readonly suppliedAddBack: number;
  readonly suppliedDeduction: number;
};
export type Output = { readonly adjustedMetric: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedMetric: { type: "number" },
    suppliedAddBack: { type: "number" },
    suppliedDeduction: { type: "number" },
  },
  required: ["reportedMetric", "suppliedAddBack", "suppliedDeduction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { adjustedMetric: { type: "number" } },
  required: ["adjustedMetric"],
} as const;
/** Adjust a supplied debt-covenant metric by explicit signed add-back and deduction amounts without interpreting covenant definitions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedMetric, suppliedAddBack, suppliedDeduction } = request;
  const compute = (): Output => {
    return {
      adjustedMetric: reportedMetric + suppliedAddBack - suppliedDeduction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reportedMetric: 100, suppliedAddBack: 20, suppliedDeduction: 5 },
  output: { adjustedMetric: 115 },
} satisfies ToolExample<Input, Output>;
export const debtCovenantDefinitionAdjustmentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "trading"],
      fields: [
        "corporate-finance",
        "corporate finance",
        "business and finance",
      ],
      keywords: ["corporate finance", "business and finance"],
    },
    id: "corporate-finance/debt-covenant-definition-adjustment",
    title: "Debt Covenant Definition Adjustment",
    description:
      "Adjust a supplied debt-covenant metric by explicit signed add-back and deduction amounts without interpreting covenant definitions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedMetric: { type: "number" },
        suppliedAddBack: { type: "number" },
        suppliedDeduction: { type: "number" },
      },
      required: ["reportedMetric", "suppliedAddBack", "suppliedDeduction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { adjustedMetric: { type: "number" } },
      required: ["adjustedMetric"],
    },
    ports: {
      inputs: [
        {
          id: "reportedMetric",
          label: "Reported Metric",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedAddBack",
          label: "Supplied Add Back",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDeduction",
          label: "Supplied Deduction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "adjustedMetric",
          label: "Adjusted Metric",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = debtCovenantDefinitionAdjustmentTool.execute;
export default debtCovenantDefinitionAdjustmentTool;
