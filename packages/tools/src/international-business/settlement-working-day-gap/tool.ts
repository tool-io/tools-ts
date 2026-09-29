import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredWorkingDays: number;
  readonly suppliedEligibleDates: readonly string[];
};
export type Output = { readonly availableDays: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredWorkingDays: { type: "integer", minimum: 0 },
    suppliedEligibleDates: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["requiredWorkingDays", "suppliedEligibleDates"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { availableDays: { type: "integer" }, gap: { type: "integer" } },
  required: ["availableDays", "gap"],
} as const;
/** Compare an explicit day requirement with caller-verified eligible dates; no holiday calendar is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredWorkingDays, suppliedEligibleDates } = request;
  const compute = (): Output => {
    H.integer(requiredWorkingDays, 0);
    suppliedEligibleDates.forEach(H.dateOnly);
    return {
      availableDays: new Set(suppliedEligibleDates).size,
      gap: new Set(suppliedEligibleDates).size - requiredWorkingDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requiredWorkingDays: 3,
    suppliedEligibleDates: ["2026-01-05", "2026-01-06"],
  },
  output: { availableDays: 2, gap: -1 },
} satisfies ToolExample<Input, Output>;
export const settlementWorkingDayGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-business/settlement-working-day-gap",
    title: "Settlement Working Day Gap Tool",
    description:
      "Compare an explicit day requirement with caller-verified eligible dates; no holiday calendar is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredWorkingDays: { type: "integer", minimum: 0 },
        suppliedEligibleDates: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["requiredWorkingDays", "suppliedEligibleDates"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableDays: { type: "integer" },
        gap: { type: "integer" },
      },
      required: ["availableDays", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "requiredWorkingDays",
          label: "Required Working Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedEligibleDates",
          label: "Supplied Eligible Dates",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "availableDays",
          label: "Available Days",
          valueType: { type: "integer" },
        },
        { id: "gap", label: "Gap", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = settlementWorkingDayGapTool.execute;
export default settlementWorkingDayGapTool;
