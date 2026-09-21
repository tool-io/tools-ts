import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly carryoverUnits: number;
  readonly usedUnits: number;
  readonly checkDay: number;
  readonly expiryDay: number;
  readonly expiryIncluded: boolean;
};
export type Output = {
  readonly remainingUnits: number;
  readonly expirySlack: number;
  readonly usableUnderBoundary: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    carryoverUnits: { type: "number", minimum: 0 },
    usedUnits: { type: "number", minimum: 0 },
    checkDay: { type: "integer" },
    expiryDay: { type: "integer" },
    expiryIncluded: { type: "boolean" },
  },
  required: [
    "carryoverUnits",
    "usedUnits",
    "checkDay",
    "expiryDay",
    "expiryIncluded",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingUnits: { type: "number" },
    expirySlack: { type: "integer" },
    usableUnderBoundary: { type: "boolean" },
  },
  required: ["remainingUnits", "expirySlack", "usableUnderBoundary"],
} as const;
/** Compare supplied quota carryover quantities and expiry convention without determining entitlement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { carryoverUnits, usedUnits, checkDay, expiryDay, expiryIncluded } =
    request;
  const compute = (): Output => {
    H.domain(
      carryoverUnits >= 0 && usedUnits >= 0 && usedUnits <= carryoverUnits,
    );
    return {
      remainingUnits: carryoverUnits - usedUnits,
      expirySlack: expiryDay - checkDay,
      usableUnderBoundary: expiryIncluded
        ? checkDay <= expiryDay
        : checkDay < expiryDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    carryoverUnits: 100,
    usedUnits: 30,
    checkDay: 10,
    expiryDay: 10,
    expiryIncluded: true,
  },
  output: { remainingUnits: 70, expirySlack: 0, usableUnderBoundary: true },
} satisfies ToolExample<Input, Output>;
export const quotaCarryoverExpiryGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-policy/quota-carryover-expiry-gap",
    title: "Quota Carryover Expiry Gap Tool",
    description:
      "Compare supplied quota carryover quantities and expiry convention without determining entitlement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        carryoverUnits: { type: "number", minimum: 0 },
        usedUnits: { type: "number", minimum: 0 },
        checkDay: { type: "integer" },
        expiryDay: { type: "integer" },
        expiryIncluded: { type: "boolean" },
      },
      required: [
        "carryoverUnits",
        "usedUnits",
        "checkDay",
        "expiryDay",
        "expiryIncluded",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingUnits: { type: "number" },
        expirySlack: { type: "integer" },
        usableUnderBoundary: { type: "boolean" },
      },
      required: ["remainingUnits", "expirySlack", "usableUnderBoundary"],
    },
    ports: {
      inputs: [
        {
          id: "carryoverUnits",
          label: "Carryover Units",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "usedUnits",
          label: "Used Units",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "checkDay",
          label: "Check Day",
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
          id: "expiryIncluded",
          label: "Expiry Included",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "remainingUnits",
          label: "Remaining Units",
          valueType: { type: "number" },
        },
        {
          id: "expirySlack",
          label: "Expiry Slack",
          valueType: { type: "integer" },
        },
        {
          id: "usableUnderBoundary",
          label: "Usable Under Boundary",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = quotaCarryoverExpiryGapTool.execute;
export default quotaCarryoverExpiryGapTool;
