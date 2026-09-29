import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly shipmentDay: number;
  readonly presentationDay: number;
  readonly expiryDay: number;
  readonly allowedPresentationDays: number;
};
export type Output = {
  readonly shipmentPresentationGap: number;
  readonly expiryMargin: number;
  readonly withinSuppliedDates: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shipmentDay: { type: "integer" },
    presentationDay: { type: "integer" },
    expiryDay: { type: "integer" },
    allowedPresentationDays: { type: "integer", minimum: 0 },
  },
  required: [
    "shipmentDay",
    "presentationDay",
    "expiryDay",
    "allowedPresentationDays",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shipmentPresentationGap: { type: "integer" },
    expiryMargin: { type: "integer" },
    withinSuppliedDates: { type: "boolean" },
  },
  required: ["shipmentPresentationGap", "expiryMargin", "withinSuppliedDates"],
} as const;
/** Compare explicit documentary dates and a caller-supplied presentation limit, not a full UCP document-compliance assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { shipmentDay, presentationDay, expiryDay, allowedPresentationDays } =
    request;
  const compute = (): Output => {
    H.integer(allowedPresentationDays, 0);
    return {
      shipmentPresentationGap: presentationDay - shipmentDay,
      expiryMargin: expiryDay - presentationDay,
      withinSuppliedDates:
        presentationDay >= shipmentDay &&
        presentationDay <= expiryDay &&
        presentationDay - shipmentDay <= allowedPresentationDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    shipmentDay: 100,
    presentationDay: 115,
    expiryDay: 120,
    allowedPresentationDays: 21,
  },
  output: {
    shipmentPresentationGap: 15,
    expiryMargin: 5,
    withinSuppliedDates: true,
  },
} satisfies ToolExample<Input, Output>;
export const letterOfCreditExpiryPresentationGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "international-business/letter-of-credit-expiry-presentation-gap",
      title: "Letter Of Credit Expiry Presentation Gap Tool",
      description:
        "Compare explicit documentary dates and a caller-supplied presentation limit, not a full UCP document-compliance assessment.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          shipmentDay: { type: "integer" },
          presentationDay: { type: "integer" },
          expiryDay: { type: "integer" },
          allowedPresentationDays: { type: "integer", minimum: 0 },
        },
        required: [
          "shipmentDay",
          "presentationDay",
          "expiryDay",
          "allowedPresentationDays",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          shipmentPresentationGap: { type: "integer" },
          expiryMargin: { type: "integer" },
          withinSuppliedDates: { type: "boolean" },
        },
        required: [
          "shipmentPresentationGap",
          "expiryMargin",
          "withinSuppliedDates",
        ],
      },
      ports: {
        inputs: [
          {
            id: "shipmentDay",
            label: "Shipment Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "presentationDay",
            label: "Presentation Day",
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
            id: "allowedPresentationDays",
            label: "Allowed Presentation Days",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "shipmentPresentationGap",
            label: "Shipment Presentation Gap",
            valueType: { type: "integer" },
          },
          {
            id: "expiryMargin",
            label: "Expiry Margin",
            valueType: { type: "integer" },
          },
          {
            id: "withinSuppliedDates",
            label: "Within Supplied Dates",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = letterOfCreditExpiryPresentationGapTool.execute;
export default letterOfCreditExpiryPresentationGapTool;
