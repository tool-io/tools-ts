import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly arrivalDay: number;
  readonly releaseDay: number;
  readonly freeDays: number;
  readonly chargePerDay: number;
  readonly arrivalDayCounts: boolean;
};
export type Output = {
  readonly elapsedChargeDays: number;
  readonly billableDays: number;
  readonly cost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    arrivalDay: { type: "integer" },
    releaseDay: { type: "integer" },
    freeDays: { type: "integer", minimum: 0 },
    chargePerDay: { type: "number", minimum: 0 },
    arrivalDayCounts: { type: "boolean" },
  },
  required: [
    "arrivalDay",
    "releaseDay",
    "freeDays",
    "chargePerDay",
    "arrivalDayCounts",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedChargeDays: { type: "integer" },
    billableDays: { type: "integer" },
    cost: { type: "number" },
  },
  required: ["elapsedChargeDays", "billableDays", "cost"],
} as const;
/** Whole-day linear demurrage under an explicit arrival-day inclusion convention; no port business calendar or tier schedule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { arrivalDay, releaseDay, freeDays, chargePerDay, arrivalDayCounts } =
    request;
  const compute = (): Output => {
    H.domain(releaseDay >= arrivalDay && chargePerDay >= 0);
    H.integer(freeDays, 0);
    return {
      elapsedChargeDays: releaseDay - arrivalDay + (arrivalDayCounts ? 1 : 0),
      billableDays: Math.max(
        0,
        releaseDay - arrivalDay + (arrivalDayCounts ? 1 : 0) - freeDays,
      ),
      cost:
        Math.max(
          0,
          releaseDay - arrivalDay + (arrivalDayCounts ? 1 : 0) - freeDays,
        ) * chargePerDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    arrivalDay: 10,
    releaseDay: 18,
    freeDays: 5,
    chargePerDay: 100,
    arrivalDayCounts: false,
  },
  output: { elapsedChargeDays: 8, billableDays: 3, cost: 300 },
} satisfies ToolExample<Input, Output>;
export const importDemurrageFreeDayGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-business/import-demurrage-free-day-gap",
    title: "Import Demurrage Free Day Gap Tool",
    description:
      "Whole-day linear demurrage under an explicit arrival-day inclusion convention; no port business calendar or tier schedule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        arrivalDay: { type: "integer" },
        releaseDay: { type: "integer" },
        freeDays: { type: "integer", minimum: 0 },
        chargePerDay: { type: "number", minimum: 0 },
        arrivalDayCounts: { type: "boolean" },
      },
      required: [
        "arrivalDay",
        "releaseDay",
        "freeDays",
        "chargePerDay",
        "arrivalDayCounts",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsedChargeDays: { type: "integer" },
        billableDays: { type: "integer" },
        cost: { type: "number" },
      },
      required: ["elapsedChargeDays", "billableDays", "cost"],
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
          id: "releaseDay",
          label: "Release Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "freeDays",
          label: "Free Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "chargePerDay",
          label: "Charge Per Day",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "arrivalDayCounts",
          label: "Arrival Day Counts",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "elapsedChargeDays",
          label: "Elapsed Charge Days",
          valueType: { type: "integer" },
        },
        {
          id: "billableDays",
          label: "Billable Days",
          valueType: { type: "integer" },
        },
        { id: "cost", label: "Cost", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = importDemurrageFreeDayGapTool.execute;
export default importDemurrageFreeDayGapTool;
