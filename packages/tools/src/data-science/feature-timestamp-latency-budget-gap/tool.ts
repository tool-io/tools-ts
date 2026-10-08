import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly actualLatency: number;
  readonly allowedLatency: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualLatency: { type: "number" },
    allowedLatency: { type: "number" },
  },
  required: ["actualLatency", "allowedLatency"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate supplied feature latency budget minus actual latency without selecting a freshness policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { actualLatency, allowedLatency } = request;
  const compute = (): Output => {
    return { signedGap: allowedLatency - actualLatency };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { actualLatency: 12, allowedLatency: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const featureTimestampLatencyBudgetGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "data-science/feature-timestamp-latency-budget-gap",
    title: "Feature Timestamp Latency Budget Gap Tool",
    description:
      "Calculate supplied feature latency budget minus actual latency without selecting a freshness policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actualLatency: { type: "number" },
        allowedLatency: { type: "number" },
      },
      required: ["actualLatency", "allowedLatency"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "actualLatency",
          label: "Actual Latency",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allowedLatency",
          label: "Allowed Latency",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = featureTimestampLatencyBudgetGapTool.execute;
export default featureTimestampLatencyBudgetGapTool;
