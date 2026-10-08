import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly score: number;
  readonly lowerEndpoint: number;
  readonly upperEndpoint: number;
};
export type Output = { readonly reversedScore: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "number" },
    lowerEndpoint: { type: "number" },
    upperEndpoint: { type: "number" },
  },
  required: ["score", "lowerEndpoint", "upperEndpoint"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reversedScore: { type: "number" } },
  required: ["reversedScore"],
} as const;
/** Reverse a supplied effort-scale score within explicit inclusive endpoints without interpreting scale direction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { score, lowerEndpoint, upperEndpoint } = request;
  const compute = (): Output => {
    H.domain(upperEndpoint > lowerEndpoint, "upperEndpoint");
    H.domain(score >= lowerEndpoint && score <= upperEndpoint, "score");
    return { reversedScore: lowerEndpoint + (upperEndpoint - score) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { score: 2, lowerEndpoint: 1, upperEndpoint: 7 },
  output: { reversedScore: 6 },
} satisfies ToolExample<Input, Output>;
export const customerEffortScaleEndpointReversalTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: [
          "consumer-behavior",
          "consumer behavior",
          "business and finance",
        ],
        keywords: ["consumer behavior", "business and finance"],
      },
      id: "consumer-behavior/customer-effort-scale-endpoint-reversal",
      title: "Customer Effort Scale Endpoint Reversal",
      description:
        "Reverse a supplied effort-scale score within explicit inclusive endpoints without interpreting scale direction.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          score: { type: "number" },
          lowerEndpoint: { type: "number" },
          upperEndpoint: { type: "number" },
        },
        required: ["score", "lowerEndpoint", "upperEndpoint"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { reversedScore: { type: "number" } },
        required: ["reversedScore"],
      },
      ports: {
        inputs: [
          {
            id: "score",
            label: "Score",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "lowerEndpoint",
            label: "Lower Endpoint",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "upperEndpoint",
            label: "Upper Endpoint",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "reversedScore",
            label: "Reversed Score",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = customerEffortScaleEndpointReversalTool.execute;
export default customerEffortScaleEndpointReversalTool;
