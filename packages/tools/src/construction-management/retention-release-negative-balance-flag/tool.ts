import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly held: number;
  readonly approvedRelease: number;
  readonly previouslyReleased: number;
};
export type Output = { readonly remaining: number; readonly negative: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    held: { type: "number", minimum: 0 },
    approvedRelease: { type: "number", minimum: 0 },
    previouslyReleased: { type: "number", minimum: 0 },
  },
  required: ["held", "approvedRelease", "previouslyReleased"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remaining: { type: "number" }, negative: { type: "boolean" } },
  required: ["remaining", "negative"],
} as const;
/** Calculate retention release negative balance flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { held, approvedRelease, previouslyReleased } = request;
  const compute = (): Output => {
    H.domain(held >= 0 && approvedRelease >= 0 && previouslyReleased >= 0);
    return {
      remaining: held - approvedRelease - previouslyReleased,
      negative: held < approvedRelease + previouslyReleased,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { held: 100, approvedRelease: 60, previouslyReleased: 50 },
  output: { remaining: -10, negative: true },
} satisfies ToolExample<Input, Output>;
export const retentionReleaseNegativeBalanceFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "construction-management/retention-release-negative-balance-flag",
      title: "Retention Release Negative Balance Flag Tool",
      description:
        "Calculate retention release negative balance flag from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          held: { type: "number", minimum: 0 },
          approvedRelease: { type: "number", minimum: 0 },
          previouslyReleased: { type: "number", minimum: 0 },
        },
        required: ["held", "approvedRelease", "previouslyReleased"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          remaining: { type: "number" },
          negative: { type: "boolean" },
        },
        required: ["remaining", "negative"],
      },
      ports: {
        inputs: [
          {
            id: "held",
            label: "Held",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "approvedRelease",
            label: "Approved Release",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "previouslyReleased",
            label: "Previously Released",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "remaining",
            label: "Remaining",
            valueType: { type: "number" },
          },
          { id: "negative", label: "Negative", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = retentionReleaseNegativeBalanceFlagTool.execute;
export default retentionReleaseNegativeBalanceFlagTool;
