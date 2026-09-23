import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationDay: number;
  readonly startDay: number;
  readonly expiryDay: number;
  readonly requiredRemaining: number;
  readonly revoked: boolean;
};
export type Output = {
  readonly insideWindow: boolean;
  readonly remainingDays: number;
  readonly marginDays: number;
  readonly matchesUnderFlags: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationDay: { type: "integer" },
    startDay: { type: "integer" },
    expiryDay: { type: "integer" },
    requiredRemaining: { type: "integer", minimum: 0 },
    revoked: { type: "boolean" },
  },
  required: [
    "observationDay",
    "startDay",
    "expiryDay",
    "requiredRemaining",
    "revoked",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    insideWindow: { type: "boolean" },
    remainingDays: { type: "integer" },
    marginDays: { type: "integer" },
    matchesUnderFlags: { type: "boolean" },
  },
  required: [
    "insideWindow",
    "remainingDays",
    "marginDays",
    "matchesUnderFlags",
  ],
} as const;
/** Audit explicit authorization dates and revocation flags without granting access. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationDay, startDay, expiryDay, requiredRemaining, revoked } =
    request;
  const compute = (): Output => {
    H.domain(expiryDay >= startDay);
    H.integer(requiredRemaining, 0);
    return {
      insideWindow: observationDay >= startDay && observationDay <= expiryDay,
      remainingDays: expiryDay - observationDay,
      marginDays: expiryDay - observationDay - requiredRemaining,
      matchesUnderFlags:
        observationDay >= startDay &&
        expiryDay - observationDay >= requiredRemaining &&
        !revoked,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observationDay: 110,
    startDay: 100,
    expiryDay: 130,
    requiredRemaining: 10,
    revoked: false,
  },
  output: {
    insideWindow: true,
    remainingDays: 20,
    marginDays: 10,
    matchesUnderFlags: true,
  },
} satisfies ToolExample<Input, Output>;
export const biosecurityAuthorizedAccessExpiryGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosecurity/biosecurity-authorized-access-expiry-gap",
      title: "Biosecurity Authorized Access Expiry Gap Tool",
      description:
        "Audit explicit authorization dates and revocation flags without granting access.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observationDay: { type: "integer" },
          startDay: { type: "integer" },
          expiryDay: { type: "integer" },
          requiredRemaining: { type: "integer", minimum: 0 },
          revoked: { type: "boolean" },
        },
        required: [
          "observationDay",
          "startDay",
          "expiryDay",
          "requiredRemaining",
          "revoked",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          insideWindow: { type: "boolean" },
          remainingDays: { type: "integer" },
          marginDays: { type: "integer" },
          matchesUnderFlags: { type: "boolean" },
        },
        required: [
          "insideWindow",
          "remainingDays",
          "marginDays",
          "matchesUnderFlags",
        ],
      },
      ports: {
        inputs: [
          {
            id: "observationDay",
            label: "Observation Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "startDay",
            label: "Start Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "expiryDay",
            label: "Expiry Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "requiredRemaining",
            label: "Required Remaining",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "revoked",
            label: "Revoked",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "insideWindow",
            label: "Inside Window",
            valueType: { type: "boolean" },
          },
          {
            id: "remainingDays",
            label: "Remaining Days",
            valueType: { type: "integer" },
          },
          {
            id: "marginDays",
            label: "Margin Days",
            valueType: { type: "integer" },
          },
          {
            id: "matchesUnderFlags",
            label: "Matches Under Flags",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biosecurityAuthorizedAccessExpiryGapTool.execute;
export default biosecurityAuthorizedAccessExpiryGapTool;
