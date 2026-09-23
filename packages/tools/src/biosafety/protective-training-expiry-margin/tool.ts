import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly expiry: number;
  readonly reviewedAt: number;
  readonly inclusiveExpiry: boolean;
};
export type Output = {
  readonly remaining: number;
  readonly currentUnderRule: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expiry: { type: "number" },
    reviewedAt: { type: "number" },
    inclusiveExpiry: { type: "boolean" },
  },
  required: ["expiry", "reviewedAt", "inclusiveExpiry"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remaining: { type: "number" },
    currentUnderRule: { type: "boolean" },
  },
  required: ["remaining", "currentUnderRule"],
} as const;
/** Audit explicit protective-training record dates without certifying readiness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expiry, reviewedAt, inclusiveExpiry } = request;
  const compute = (): Output => {
    return {
      remaining: expiry - reviewedAt,
      currentUnderRule: inclusiveExpiry
        ? reviewedAt <= expiry
        : reviewedAt < expiry,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { expiry: 30, reviewedAt: 20, inclusiveExpiry: false },
  output: { remaining: 10, currentUnderRule: true },
} satisfies ToolExample<Input, Output>;
export const protectiveTrainingExpiryMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosafety/protective-training-expiry-margin",
    title: "Protective Training Expiry Margin Tool",
    description:
      "Audit explicit protective-training record dates without certifying readiness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expiry: { type: "number" },
        reviewedAt: { type: "number" },
        inclusiveExpiry: { type: "boolean" },
      },
      required: ["expiry", "reviewedAt", "inclusiveExpiry"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remaining: { type: "number" },
        currentUnderRule: { type: "boolean" },
      },
      required: ["remaining", "currentUnderRule"],
    },
    ports: {
      inputs: [
        {
          id: "expiry",
          label: "Expiry",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reviewedAt",
          label: "Reviewed At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inclusiveExpiry",
          label: "Inclusive Expiry",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
        {
          id: "currentUnderRule",
          label: "Current Under Rule",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = protectiveTrainingExpiryMarginTool.execute;
export default protectiveTrainingExpiryMarginTool;
