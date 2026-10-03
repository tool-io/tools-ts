import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly expiryDay: number;
  readonly observationDay: number;
  readonly noticeLead: number;
  readonly inclusiveExpiry: boolean;
};
export type Output = {
  readonly remainingDays: number;
  readonly noticeDue: boolean;
  readonly expired: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expiryDay: { type: "integer" },
    observationDay: { type: "integer" },
    noticeLead: { type: "integer", minimum: 0 },
    inclusiveExpiry: { type: "boolean" },
  },
  required: ["expiryDay", "observationDay", "noticeLead", "inclusiveExpiry"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingDays: { type: "integer" },
    noticeDue: { type: "boolean" },
    expired: { type: "boolean" },
  },
  required: ["remainingDays", "noticeDue", "expired"],
} as const;
/** Calculate product registration expiry explicit gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expiryDay, observationDay, noticeLead, inclusiveExpiry } = request;
  const compute = (): Output => {
    H.integer(noticeLead, 0);
    return {
      remainingDays: expiryDay - observationDay,
      noticeDue: observationDay >= expiryDay - noticeLead,
      expired: inclusiveExpiry
        ? observationDay > expiryDay
        : observationDay >= expiryDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    expiryDay: 130,
    observationDay: 120,
    noticeLead: 15,
    inclusiveExpiry: true,
  },
  output: { remainingDays: 10, noticeDue: true, expired: false },
} satisfies ToolExample<Input, Output>;
export const productRegistrationExpiryExplicitGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "regulatory-affairs/product-registration-expiry-explicit-gap",
      title: "Product Registration Expiry Explicit Gap Tool",
      description:
        "Calculate product registration expiry explicit gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          expiryDay: { type: "integer" },
          observationDay: { type: "integer" },
          noticeLead: { type: "integer", minimum: 0 },
          inclusiveExpiry: { type: "boolean" },
        },
        required: [
          "expiryDay",
          "observationDay",
          "noticeLead",
          "inclusiveExpiry",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          remainingDays: { type: "integer" },
          noticeDue: { type: "boolean" },
          expired: { type: "boolean" },
        },
        required: ["remainingDays", "noticeDue", "expired"],
      },
      ports: {
        inputs: [
          {
            id: "expiryDay",
            label: "Expiry Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "observationDay",
            label: "Observation Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "noticeLead",
            label: "Notice Lead",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "inclusiveExpiry",
            label: "Inclusive Expiry",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "remainingDays",
            label: "Remaining Days",
            valueType: { type: "integer" },
          },
          {
            id: "noticeDue",
            label: "Notice Due",
            valueType: { type: "boolean" },
          },
          { id: "expired", label: "Expired", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = productRegistrationExpiryExplicitGapTool.execute;
export default productRegistrationExpiryExplicitGapTool;
