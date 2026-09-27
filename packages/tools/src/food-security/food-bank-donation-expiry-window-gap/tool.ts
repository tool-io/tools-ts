import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly arrivalDay: number;
  readonly printedDay: number;
  readonly minimumRemainingDays: number;
};
export type Output = {
  readonly remainingDays: number;
  readonly marginDays: number;
  readonly meetsSuppliedWindow: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    arrivalDay: { type: "integer" },
    printedDay: { type: "integer" },
    minimumRemainingDays: { type: "integer", minimum: 0 },
  },
  required: ["arrivalDay", "printedDay", "minimumRemainingDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingDays: { type: "integer" },
    marginDays: { type: "integer" },
    meetsSuppliedWindow: { type: "boolean" },
  },
  required: ["remainingDays", "marginDays", "meetsSuppliedWindow"],
} as const;
/** Compare a supplied date window without interpreting date-label safety or edibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { arrivalDay, printedDay, minimumRemainingDays } = request;
  const compute = (): Output => {
    H.integer(minimumRemainingDays, 0);
    return {
      remainingDays: printedDay - arrivalDay,
      marginDays: printedDay - arrivalDay - minimumRemainingDays,
      meetsSuppliedWindow: printedDay - arrivalDay >= minimumRemainingDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { arrivalDay: 100, printedDay: 110, minimumRemainingDays: 7 },
  output: { remainingDays: 10, marginDays: 3, meetsSuppliedWindow: true },
} satisfies ToolExample<Input, Output>;
export const foodBankDonationExpiryWindowGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-security/food-bank-donation-expiry-window-gap",
    title: "Food Bank Donation Expiry Window Gap Tool",
    description:
      "Compare a supplied date window without interpreting date-label safety or edibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        arrivalDay: { type: "integer" },
        printedDay: { type: "integer" },
        minimumRemainingDays: { type: "integer", minimum: 0 },
      },
      required: ["arrivalDay", "printedDay", "minimumRemainingDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingDays: { type: "integer" },
        marginDays: { type: "integer" },
        meetsSuppliedWindow: { type: "boolean" },
      },
      required: ["remainingDays", "marginDays", "meetsSuppliedWindow"],
    },
    ports: {
      inputs: [
        {
          id: "arrivalDay",
          label: "Arrival Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "printedDay",
          label: "Printed Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "minimumRemainingDays",
          label: "Minimum Remaining Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
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
          id: "meetsSuppliedWindow",
          label: "Meets Supplied Window",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodBankDonationExpiryWindowGapTool.execute;
export default foodBankDonationExpiryWindowGapTool;
