import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly numerator: number;
  readonly denominator: number;
};
export type Output = {
  readonly numeratorDerivative: number;
  readonly denominatorDerivative: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numerator: { type: "number" },
    denominator: { type: "number" },
  },
  required: ["numerator", "denominator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numeratorDerivative: { type: "number" },
    denominatorDerivative: { type: "number" },
  },
  required: ["numeratorDerivative", "denominatorDerivative"],
} as const;
/** Return local partial derivatives of numerator/denominator with respect to its two supplied components. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { numerator, denominator } = request;
  const compute = (): Output => {
    H.domain(denominator !== 0);
    return {
      numeratorDerivative: 1 / denominator,
      denominatorDerivative: -numerator / denominator ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { numerator: 10, denominator: 2 },
  output: { numeratorDerivative: 0.5, denominatorDerivative: -2.5 },
} satisfies ToolExample<Input, Output>;
export const ratioMetricSensitivityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/ratio-metric-sensitivity",
    title: "Ratio Metric Sensitivity Tool",
    description:
      "Return local partial derivatives of numerator/denominator with respect to its two supplied components.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        numerator: { type: "number" },
        denominator: { type: "number" },
      },
      required: ["numerator", "denominator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        numeratorDerivative: { type: "number" },
        denominatorDerivative: { type: "number" },
      },
      required: ["numeratorDerivative", "denominatorDerivative"],
    },
    ports: {
      inputs: [
        {
          id: "numerator",
          label: "Numerator",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "denominator",
          label: "Denominator",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "numeratorDerivative",
          label: "Numerator Derivative",
          valueType: { type: "number" },
        },
        {
          id: "denominatorDerivative",
          label: "Denominator Derivative",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ratioMetricSensitivityTool.execute;
export default ratioMetricSensitivityTool;
