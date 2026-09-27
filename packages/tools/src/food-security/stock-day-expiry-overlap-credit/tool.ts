import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stockDays: number;
  readonly expiryExcludedDays: number;
  readonly unavailableDays: number;
  readonly sharedExcludedDays: number;
};
export type Output = {
  readonly usableDays: number;
  readonly excludedDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stockDays: { type: "number", minimum: 0 },
    expiryExcludedDays: { type: "number", minimum: 0 },
    unavailableDays: { type: "number", minimum: 0 },
    sharedExcludedDays: { type: "number", minimum: 0 },
  },
  required: [
    "stockDays",
    "expiryExcludedDays",
    "unavailableDays",
    "sharedExcludedDays",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usableDays: { type: "number" },
    excludedDays: { type: "number" },
  },
  required: ["usableDays", "excludedDays"],
} as const;
/** Audit supplied disjoint/overlapping stock-day exclusions without inferring food usability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stockDays, expiryExcludedDays, unavailableDays, sharedExcludedDays } =
    request;
  const compute = (): Output => {
    H.domain(
      stockDays >= 0 &&
        expiryExcludedDays >= 0 &&
        unavailableDays >= 0 &&
        sharedExcludedDays >= 0 &&
        sharedExcludedDays <= Math.min(expiryExcludedDays, unavailableDays) &&
        expiryExcludedDays + unavailableDays - sharedExcludedDays <= stockDays,
    );
    return {
      usableDays:
        stockDays - expiryExcludedDays - unavailableDays + sharedExcludedDays,
      excludedDays: expiryExcludedDays + unavailableDays - sharedExcludedDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    stockDays: 30,
    expiryExcludedDays: 5,
    unavailableDays: 4,
    sharedExcludedDays: 2,
  },
  output: { usableDays: 23, excludedDays: 7 },
} satisfies ToolExample<Input, Output>;
export const stockDayExpiryOverlapCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-security/stock-day-expiry-overlap-credit",
    title: "Stock Day Expiry Overlap Credit Tool",
    description:
      "Audit supplied disjoint/overlapping stock-day exclusions without inferring food usability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stockDays: { type: "number", minimum: 0 },
        expiryExcludedDays: { type: "number", minimum: 0 },
        unavailableDays: { type: "number", minimum: 0 },
        sharedExcludedDays: { type: "number", minimum: 0 },
      },
      required: [
        "stockDays",
        "expiryExcludedDays",
        "unavailableDays",
        "sharedExcludedDays",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        usableDays: { type: "number" },
        excludedDays: { type: "number" },
      },
      required: ["usableDays", "excludedDays"],
    },
    ports: {
      inputs: [
        {
          id: "stockDays",
          label: "Stock Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "expiryExcludedDays",
          label: "Expiry Excluded Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unavailableDays",
          label: "Unavailable Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sharedExcludedDays",
          label: "Shared Excluded Days",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "usableDays",
          label: "Usable Days",
          valueType: { type: "number" },
        },
        {
          id: "excludedDays",
          label: "Excluded Days",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = stockDayExpiryOverlapCreditTool.execute;
export default stockDayExpiryOverlapCreditTool;
