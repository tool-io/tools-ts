import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly logProbability: number };
export type Output = {
  readonly probability: number;
  readonly underflowed: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { logProbability: { type: "number", maximum: 0 } },
  required: ["logProbability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    probability: { type: "number" },
    underflowed: { type: "boolean" },
  },
  required: ["probability", "underflowed"],
} as const;
/** Exponentiate one supplied finite nonpositive natural log-probability and flag binary64 underflow to zero. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { logProbability } = request;
  const compute = (): Output => {
    H.domain(logProbability <= 0, "logProbability");
    return {
      probability: Math.exp(logProbability),
      underflowed: Math.exp(logProbability) === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { logProbability: -1000 },
  output: { probability: 0, underflowed: true },
} satisfies ToolExample<Input, Output>;
export const modelLogProbabilityExpUnderflowFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["ai", "data"],
        fields: [
          "artificial-intelligence",
          "artificial intelligence",
          "computer science",
        ],
        keywords: ["artificial intelligence", "computer science"],
      },
      id: "artificial-intelligence/model-log-probability-exp-underflow-flag",
      title: "Model Log Probability Exp Underflow Flag",
      description:
        "Exponentiate one supplied finite nonpositive natural log-probability and flag binary64 underflow to zero.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { logProbability: { type: "number", maximum: 0 } },
        required: ["logProbability"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          probability: { type: "number" },
          underflowed: { type: "boolean" },
        },
        required: ["probability", "underflowed"],
      },
      ports: {
        inputs: [
          {
            id: "logProbability",
            label: "Log Probability",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "probability",
            label: "Probability",
            valueType: { type: "number" },
          },
          {
            id: "underflowed",
            label: "Underflowed",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = modelLogProbabilityExpUnderflowFlagTool.execute;
export default modelLogProbabilityExpUnderflowFlagTool;
