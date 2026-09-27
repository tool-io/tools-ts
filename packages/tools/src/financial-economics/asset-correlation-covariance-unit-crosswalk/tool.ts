import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly correlation: number;
  readonly firstVolatility: number;
  readonly secondVolatility: number;
  readonly firstScale: number;
  readonly secondScale: number;
};
export type Output = {
  readonly covariance: number;
  readonly scaledCovariance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correlation: { type: "number", minimum: -1, maximum: 1 },
    firstVolatility: { type: "number", minimum: 0 },
    secondVolatility: { type: "number", minimum: 0 },
    firstScale: { type: "number", exclusiveMinimum: 0 },
    secondScale: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "correlation",
    "firstVolatility",
    "secondVolatility",
    "firstScale",
    "secondScale",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    covariance: { type: "number" },
    scaledCovariance: { type: "number" },
  },
  required: ["covariance", "scaledCovariance"],
} as const;
/** Calculate asset correlation covariance unit crosswalk from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    correlation,
    firstVolatility,
    secondVolatility,
    firstScale,
    secondScale,
  } = request;
  const compute = (): Output => {
    H.domain(
      correlation >= -1 &&
        correlation <= 1 &&
        firstVolatility >= 0 &&
        secondVolatility >= 0,
    );
    H.positive(firstScale);
    H.positive(secondScale);
    return {
      covariance: correlation * firstVolatility * secondVolatility,
      scaledCovariance:
        correlation *
        firstVolatility *
        secondVolatility *
        firstScale *
        secondScale,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    correlation: 0.5,
    firstVolatility: 0.2,
    secondVolatility: 0.3,
    firstScale: 100,
    secondScale: 100,
  },
  output: { covariance: 0.03, scaledCovariance: 300 },
} satisfies ToolExample<Input, Output>;
export const assetCorrelationCovarianceUnitCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "financial-economics/asset-correlation-covariance-unit-crosswalk",
      title: "Asset Correlation Covariance Unit Crosswalk Tool",
      description:
        "Calculate asset correlation covariance unit crosswalk from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          correlation: { type: "number", minimum: -1, maximum: 1 },
          firstVolatility: { type: "number", minimum: 0 },
          secondVolatility: { type: "number", minimum: 0 },
          firstScale: { type: "number", exclusiveMinimum: 0 },
          secondScale: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "correlation",
          "firstVolatility",
          "secondVolatility",
          "firstScale",
          "secondScale",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          covariance: { type: "number" },
          scaledCovariance: { type: "number" },
        },
        required: ["covariance", "scaledCovariance"],
      },
      ports: {
        inputs: [
          {
            id: "correlation",
            label: "Correlation",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstVolatility",
            label: "First Volatility",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondVolatility",
            label: "Second Volatility",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstScale",
            label: "First Scale",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondScale",
            label: "Second Scale",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "covariance",
            label: "Covariance",
            valueType: { type: "number" },
          },
          {
            id: "scaledCovariance",
            label: "Scaled Covariance",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = assetCorrelationCovarianceUnitCrosswalkTool.execute;
export default assetCorrelationCovarianceUnitCrosswalkTool;
