import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly forecast: number;
  readonly actual: number;
  readonly unitRevenue: number;
  readonly totalActualRevenue: number;
};
export type Output = {
  readonly signedError: number;
  readonly absoluteRevenueError: number;
  readonly weightedContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    forecast: { type: "number", minimum: 0 },
    actual: { type: "number", minimum: 0 },
    unitRevenue: { type: "number", minimum: 0 },
    totalActualRevenue: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["forecast", "actual", "unitRevenue", "totalActualRevenue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedError: { type: "number" },
    absoluteRevenueError: { type: "number" },
    weightedContribution: { type: "number" },
  },
  required: ["signedError", "absoluteRevenueError", "weightedContribution"],
} as const;
/** Calculate forecast error revenue weight one sku from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { forecast, actual, unitRevenue, totalActualRevenue } = request;
  const compute = (): Output => {
    H.domain(forecast >= 0 && actual >= 0 && unitRevenue >= 0);
    H.positive(totalActualRevenue);
    return {
      signedError: forecast - actual,
      absoluteRevenueError: Math.abs(forecast - actual) * unitRevenue,
      weightedContribution:
        (Math.abs(forecast - actual) * unitRevenue) / totalActualRevenue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    forecast: 120,
    actual: 100,
    unitRevenue: 5,
    totalActualRevenue: 1000,
  },
  output: {
    signedError: 20,
    absoluteRevenueError: 100,
    weightedContribution: 0.1,
  },
} satisfies ToolExample<Input, Output>;
export const forecastErrorRevenueWeightOneSkuTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "business-analytics/forecast-error-revenue-weight-one-sku",
    title: "Forecast Error Revenue Weight One Sku Tool",
    description:
      "Calculate forecast error revenue weight one sku from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        forecast: { type: "number", minimum: 0 },
        actual: { type: "number", minimum: 0 },
        unitRevenue: { type: "number", minimum: 0 },
        totalActualRevenue: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["forecast", "actual", "unitRevenue", "totalActualRevenue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedError: { type: "number" },
        absoluteRevenueError: { type: "number" },
        weightedContribution: { type: "number" },
      },
      required: ["signedError", "absoluteRevenueError", "weightedContribution"],
    },
    ports: {
      inputs: [
        {
          id: "forecast",
          label: "Forecast",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "actual",
          label: "Actual",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitRevenue",
          label: "Unit Revenue",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalActualRevenue",
          label: "Total Actual Revenue",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedError",
          label: "Signed Error",
          valueType: { type: "number" },
        },
        {
          id: "absoluteRevenueError",
          label: "Absolute Revenue Error",
          valueType: { type: "number" },
        },
        {
          id: "weightedContribution",
          label: "Weighted Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = forecastErrorRevenueWeightOneSkuTool.execute;
export default forecastErrorRevenueWeightOneSkuTool;
