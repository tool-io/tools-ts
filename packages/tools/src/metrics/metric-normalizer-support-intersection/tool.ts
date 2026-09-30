import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly metricSupport: readonly boolean[];
  readonly normalizerSupport: readonly boolean[];
};
export type Output = {
  readonly jointSupport: readonly boolean[];
  readonly includedCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    metricSupport: { type: "array", maxItems: 256, items: { type: "boolean" } },
    normalizerSupport: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["metricSupport", "normalizerSupport"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    jointSupport: { type: "array", maxItems: 256, items: { type: "boolean" } },
    includedCount: { type: "integer" },
  },
  required: ["jointSupport", "includedCount"],
} as const;
/** Intersect explicit observation-support masks before using a metric denominator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { metricSupport, normalizerSupport } = request;
  const compute = (): Output => {
    H.sameLength(metricSupport, normalizerSupport);
    const jointSupport = metricSupport.map((x, i) => x && normalizerSupport[i]);
    return { jointSupport, includedCount: jointSupport.filter(Boolean).length };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    metricSupport: [true, true, false],
    normalizerSupport: [true, false, true],
  },
  output: { jointSupport: [true, false, false], includedCount: 1 },
} satisfies ToolExample<Input, Output>;
export const metricNormalizerSupportIntersectionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "metrics/metric-normalizer-support-intersection",
      title: "Metric Normalizer Support Intersection Tool",
      description:
        "Intersect explicit observation-support masks before using a metric denominator.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          metricSupport: {
            type: "array",
            maxItems: 256,
            items: { type: "boolean" },
          },
          normalizerSupport: {
            type: "array",
            maxItems: 256,
            items: { type: "boolean" },
          },
        },
        required: ["metricSupport", "normalizerSupport"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          jointSupport: {
            type: "array",
            maxItems: 256,
            items: { type: "boolean" },
          },
          includedCount: { type: "integer" },
        },
        required: ["jointSupport", "includedCount"],
      },
      ports: {
        inputs: [
          {
            id: "metricSupport",
            label: "Metric Support",
            required: true,
            valueType: { type: "list", items: { type: "boolean" } },
          },
          {
            id: "normalizerSupport",
            label: "Normalizer Support",
            required: true,
            valueType: { type: "list", items: { type: "boolean" } },
          },
        ],
        outputs: [
          {
            id: "jointSupport",
            label: "Joint Support",
            valueType: { type: "list", items: { type: "boolean" } },
          },
          {
            id: "includedCount",
            label: "Included Count",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = metricNormalizerSupportIntersectionTool.execute;
export default metricNormalizerSupportIntersectionTool;
