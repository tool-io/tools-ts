import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly attempts: number;
  readonly allowedInitial: number;
  readonly allowedRetries: number;
  readonly successfulAt: number;
  readonly success: boolean;
};
export type Output = {
  readonly allowed: number;
  readonly remaining: number;
  readonly exceeded: boolean;
  readonly successInsideBudget: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    attempts: { type: "integer", minimum: 0 },
    allowedInitial: { type: "integer", minimum: 0 },
    allowedRetries: { type: "integer", minimum: 0 },
    successfulAt: { type: "integer", minimum: 0 },
    success: { type: "boolean" },
  },
  required: [
    "attempts",
    "allowedInitial",
    "allowedRetries",
    "successfulAt",
    "success",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allowed: { type: "integer" },
    remaining: { type: "integer" },
    exceeded: { type: "boolean" },
    successInsideBudget: { type: "boolean" },
  },
  required: ["allowed", "remaining", "exceeded", "successInsideBudget"],
} as const;
/** Calculate biometric attempt retry count budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { attempts, allowedInitial, allowedRetries, successfulAt, success } =
    request;
  const compute = (): Output => {
    H.integer(attempts, 0);
    H.integer(allowedInitial, 0);
    H.integer(allowedRetries, 0);
    H.integer(successfulAt, 0, attempts);
    return {
      allowed: allowedInitial + allowedRetries,
      remaining: Math.max(0, allowedInitial + allowedRetries - attempts),
      exceeded: attempts > allowedInitial + allowedRetries,
      successInsideBudget:
        success && successfulAt <= allowedInitial + allowedRetries,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    attempts: 3,
    allowedInitial: 1,
    allowedRetries: 3,
    successfulAt: 3,
    success: true,
  },
  output: {
    allowed: 4,
    remaining: 1,
    exceeded: false,
    successInsideBudget: true,
  },
} satisfies ToolExample<Input, Output>;
export const biometricAttemptRetryCountBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biometrics/biometric-attempt-retry-count-budget",
    title: "Biometric Attempt Retry Count Budget Tool",
    description:
      "Calculate biometric attempt retry count budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        attempts: { type: "integer", minimum: 0 },
        allowedInitial: { type: "integer", minimum: 0 },
        allowedRetries: { type: "integer", minimum: 0 },
        successfulAt: { type: "integer", minimum: 0 },
        success: { type: "boolean" },
      },
      required: [
        "attempts",
        "allowedInitial",
        "allowedRetries",
        "successfulAt",
        "success",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allowed: { type: "integer" },
        remaining: { type: "integer" },
        exceeded: { type: "boolean" },
        successInsideBudget: { type: "boolean" },
      },
      required: ["allowed", "remaining", "exceeded", "successInsideBudget"],
    },
    ports: {
      inputs: [
        {
          id: "attempts",
          label: "Attempts",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "allowedInitial",
          label: "Allowed Initial",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "allowedRetries",
          label: "Allowed Retries",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "successfulAt",
          label: "Successful At",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "success",
          label: "Success",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "allowed", label: "Allowed", valueType: { type: "integer" } },
        { id: "remaining", label: "Remaining", valueType: { type: "integer" } },
        { id: "exceeded", label: "Exceeded", valueType: { type: "boolean" } },
        {
          id: "successInsideBudget",
          label: "Success Inside Budget",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = biometricAttemptRetryCountBudgetTool.execute;
export default biometricAttemptRetryCountBudgetTool;
