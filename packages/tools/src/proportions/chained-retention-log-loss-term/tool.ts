import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly retentionFractions: readonly number[] };
export type Output = {
  readonly logRetention: number;
  readonly retainedFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retentionFractions: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["retentionFractions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    logRetention: { type: "number" },
    retainedFraction: { type: "number" },
  },
  required: ["logRetention", "retainedFraction"],
} as const;
/** Calculate chained retention log loss term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { retentionFractions } = request;
  const compute = (): Output => {
    H.domain(retentionFractions.every((x) => x > 0 && x <= 1));
    const logRetention = retentionFractions.reduce(
      (a, b) => a + Math.log(b),
      0,
    );
    return { logRetention, retainedFraction: Math.exp(logRetention) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { retentionFractions: [0.5, 0.5] },
  output: { logRetention: -1.3862943611198906, retainedFraction: 0.25 },
} satisfies ToolExample<Input, Output>;
export const chainedRetentionLogLossTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/chained-retention-log-loss-term",
    title: "Chained Retention Log Loss Term Tool",
    description:
      "Calculate chained retention log loss term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retentionFractions: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["retentionFractions"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        logRetention: { type: "number" },
        retainedFraction: { type: "number" },
      },
      required: ["logRetention", "retainedFraction"],
    },
    ports: {
      inputs: [
        {
          id: "retentionFractions",
          label: "Retention Fractions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "logRetention",
          label: "Log Retention",
          valueType: { type: "number" },
        },
        {
          id: "retainedFraction",
          label: "Retained Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = chainedRetentionLogLossTermTool.execute;
export default chainedRetentionLogLossTermTool;
