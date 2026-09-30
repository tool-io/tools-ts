import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly metric: number;
  readonly unitScale: number;
  readonly exponent: number;
};
export type Output = { readonly scaledMetric: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    metric: { type: "number", minimum: 0 },
    unitScale: { type: "number", exclusiveMinimum: 0 },
    exponent: { type: "number" },
  },
  required: ["metric", "unitScale", "exponent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { scaledMetric: { type: "number" } },
  required: ["scaledMetric"],
} as const;
/** Calculate error metric unit scaling exponent from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { metric, unitScale, exponent } = request;
  const compute = (): Output => {
    H.domain(metric >= 0);
    H.positive(unitScale);
    return { scaledMetric: metric * unitScale ** exponent };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { metric: 3, unitScale: 100, exponent: 2 },
  output: { scaledMetric: 30000 },
} satisfies ToolExample<Input, Output>;
export const errorMetricUnitScalingExponentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/error-metric-unit-scaling-exponent",
    title: "Error Metric Unit Scaling Exponent Tool",
    description:
      "Calculate error metric unit scaling exponent from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        metric: { type: "number", minimum: 0 },
        unitScale: { type: "number", exclusiveMinimum: 0 },
        exponent: { type: "number" },
      },
      required: ["metric", "unitScale", "exponent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { scaledMetric: { type: "number" } },
      required: ["scaledMetric"],
    },
    ports: {
      inputs: [
        {
          id: "metric",
          label: "Metric",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitScale",
          label: "Unit Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exponent",
          label: "Exponent",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "scaledMetric",
          label: "Scaled Metric",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = errorMetricUnitScalingExponentTool.execute;
export default errorMetricUnitScalingExponentTool;
