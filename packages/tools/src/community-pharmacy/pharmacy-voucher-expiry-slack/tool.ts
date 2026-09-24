import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentDay: number;
  readonly expiryDay: number;
  readonly expiryIncluded: boolean;
};
export type Output = {
  readonly slackDays: number;
  readonly validUnderBoundary: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentDay: { type: "integer" },
    expiryDay: { type: "integer" },
    expiryIncluded: { type: "boolean" },
  },
  required: ["currentDay", "expiryDay", "expiryIncluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slackDays: { type: "integer" },
    validUnderBoundary: { type: "boolean" },
  },
  required: ["slackDays", "validUnderBoundary"],
} as const;
/** Compare supplied voucher day indices under an explicit endpoint convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentDay, expiryDay, expiryIncluded } = request;
  const compute = (): Output => {
    return {
      slackDays: expiryDay - currentDay,
      validUnderBoundary: expiryIncluded
        ? currentDay <= expiryDay
        : currentDay < expiryDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { currentDay: 10, expiryDay: 10, expiryIncluded: true },
  output: { slackDays: 0, validUnderBoundary: true },
} satisfies ToolExample<Input, Output>;
export const pharmacyVoucherExpirySlackTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "community-pharmacy/pharmacy-voucher-expiry-slack",
    title: "Pharmacy Voucher Expiry Slack Tool",
    description:
      "Compare supplied voucher day indices under an explicit endpoint convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentDay: { type: "integer" },
        expiryDay: { type: "integer" },
        expiryIncluded: { type: "boolean" },
      },
      required: ["currentDay", "expiryDay", "expiryIncluded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slackDays: { type: "integer" },
        validUnderBoundary: { type: "boolean" },
      },
      required: ["slackDays", "validUnderBoundary"],
    },
    ports: {
      inputs: [
        {
          id: "currentDay",
          label: "Current Day",
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
          id: "slackDays",
          label: "Slack Days",
          valueType: { type: "integer" },
        },
        {
          id: "validUnderBoundary",
          label: "Valid Under Boundary",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = pharmacyVoucherExpirySlackTool.execute;
export default pharmacyVoucherExpirySlackTool;
