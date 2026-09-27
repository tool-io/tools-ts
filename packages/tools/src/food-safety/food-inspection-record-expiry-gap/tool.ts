import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly issuedDay: number;
  readonly validityDays: number;
  readonly queryDay: number;
};
export type Output = {
  readonly expiryDay: number;
  readonly remainingDays: number;
  readonly expired: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    issuedDay: { type: "integer" },
    validityDays: { type: "integer", minimum: 0 },
    queryDay: { type: "integer" },
  },
  required: ["issuedDay", "validityDays", "queryDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expiryDay: { type: "integer" },
    remainingDays: { type: "integer" },
    expired: { type: "boolean" },
  },
  required: ["expiryDay", "remainingDays", "expired"],
} as const;
/** Inclusive final day under an explicitly supplied record-validity convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { issuedDay, validityDays, queryDay } = request;
  const compute = (): Output => {
    H.integer(validityDays, 0);
    return {
      expiryDay: issuedDay + validityDays,
      remainingDays: issuedDay + validityDays - queryDay,
      expired: queryDay > issuedDay + validityDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { issuedDay: 100, validityDays: 30, queryDay: 120 },
  output: { expiryDay: 130, remainingDays: 10, expired: false },
} satisfies ToolExample<Input, Output>;
export const foodInspectionRecordExpiryGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-safety/food-inspection-record-expiry-gap",
    title: "Food Inspection Record Expiry Gap Tool",
    description:
      "Inclusive final day under an explicitly supplied record-validity convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        issuedDay: { type: "integer" },
        validityDays: { type: "integer", minimum: 0 },
        queryDay: { type: "integer" },
      },
      required: ["issuedDay", "validityDays", "queryDay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expiryDay: { type: "integer" },
        remainingDays: { type: "integer" },
        expired: { type: "boolean" },
      },
      required: ["expiryDay", "remainingDays", "expired"],
    },
    ports: {
      inputs: [
        {
          id: "issuedDay",
          label: "Issued Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "validityDays",
          label: "Validity Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "queryDay",
          label: "Query Day",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "expiryDay",
          label: "Expiry Day",
          valueType: { type: "integer" },
        },
        {
          id: "remainingDays",
          label: "Remaining Days",
          valueType: { type: "integer" },
        },
        { id: "expired", label: "Expired", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = foodInspectionRecordExpiryGapTool.execute;
export default foodInspectionRecordExpiryGapTool;
