import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly revenue: number; readonly cost: number };
export type Output = {
  readonly revenueDerivative: number;
  readonly costDerivative: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { revenue: { type: "number" }, cost: { type: "number" } },
  required: ["revenue", "cost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    revenueDerivative: { type: "number" },
    costDerivative: { type: "number" },
  },
  required: ["revenueDerivative", "costDerivative"],
} as const;
/** Differentiate proportional gross margin (revenue-cost)/revenue with respect to both inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { revenue, cost } = request;
  const compute = (): Output => {
    H.domain(revenue !== 0);
    return {
      revenueDerivative: cost / (revenue * revenue),
      costDerivative: -1 / revenue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { revenue: 100, cost: 60 },
  output: { revenueDerivative: 0.006, costDerivative: -0.01 },
} satisfies ToolExample<Input, Output>;
export const proportionalMarginOneInputSensitivityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "proportions/proportional-margin-one-input-sensitivity",
      title: "Proportional Margin One Input Sensitivity Tool",
      description:
        "Differentiate proportional gross margin (revenue-cost)/revenue with respect to both inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { revenue: { type: "number" }, cost: { type: "number" } },
        required: ["revenue", "cost"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          revenueDerivative: { type: "number" },
          costDerivative: { type: "number" },
        },
        required: ["revenueDerivative", "costDerivative"],
      },
      ports: {
        inputs: [
          {
            id: "revenue",
            label: "Revenue",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "cost",
            label: "Cost",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "revenueDerivative",
            label: "Revenue Derivative",
            valueType: { type: "number" },
          },
          {
            id: "costDerivative",
            label: "Cost Derivative",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = proportionalMarginOneInputSensitivityTool.execute;
export default proportionalMarginOneInputSensitivityTool;
