import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly onHand: number;
  readonly reserved: number;
  readonly dailyUse: number;
  readonly leadDays: number;
  readonly safetyDays: number;
};
export type Output = {
  readonly usable: number;
  readonly daysCover: number;
  readonly leadDemand: number;
  readonly deficit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    onHand: { type: "integer", minimum: 0 },
    reserved: { type: "integer", minimum: 0 },
    dailyUse: { type: "number", exclusiveMinimum: 0 },
    leadDays: { type: "number", minimum: 0 },
    safetyDays: { type: "number", minimum: 0 },
  },
  required: ["onHand", "reserved", "dailyUse", "leadDays", "safetyDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usable: { type: "integer" },
    daysCover: { type: "number" },
    leadDemand: { type: "number" },
    deficit: { type: "number" },
  },
  required: ["usable", "daysCover", "leadDemand", "deficit"],
} as const;
/** Calculate pharmacy supply lead time day cover from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { onHand, reserved, dailyUse, leadDays, safetyDays } = request;
  const compute = (): Output => {
    H.integer(onHand, 0);
    H.integer(reserved, 0, onHand);
    H.positive(dailyUse);
    H.domain(leadDays >= 0 && safetyDays >= 0);
    return {
      usable: onHand - reserved,
      daysCover: (onHand - reserved) / dailyUse,
      leadDemand: dailyUse * (leadDays + safetyDays),
      deficit: Math.max(
        0,
        dailyUse * (leadDays + safetyDays) - onHand + reserved,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    onHand: 100,
    reserved: 20,
    dailyUse: 10,
    leadDays: 5,
    safetyDays: 2,
  },
  output: { usable: 80, daysCover: 8, leadDemand: 70, deficit: 0 },
} satisfies ToolExample<Input, Output>;
export const pharmacySupplyLeadTimeDayCoverTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospital-pharmacy/pharmacy-supply-lead-time-day-cover",
    title: "Pharmacy Supply Lead Time Day Cover Tool",
    description:
      "Calculate pharmacy supply lead time day cover from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        onHand: { type: "integer", minimum: 0 },
        reserved: { type: "integer", minimum: 0 },
        dailyUse: { type: "number", exclusiveMinimum: 0 },
        leadDays: { type: "number", minimum: 0 },
        safetyDays: { type: "number", minimum: 0 },
      },
      required: ["onHand", "reserved", "dailyUse", "leadDays", "safetyDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        usable: { type: "integer" },
        daysCover: { type: "number" },
        leadDemand: { type: "number" },
        deficit: { type: "number" },
      },
      required: ["usable", "daysCover", "leadDemand", "deficit"],
    },
    ports: {
      inputs: [
        {
          id: "onHand",
          label: "On Hand",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reserved",
          label: "Reserved",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "dailyUse",
          label: "Daily Use",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leadDays",
          label: "Lead Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "safetyDays",
          label: "Safety Days",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "usable", label: "Usable", valueType: { type: "integer" } },
        { id: "daysCover", label: "Days Cover", valueType: { type: "number" } },
        {
          id: "leadDemand",
          label: "Lead Demand",
          valueType: { type: "number" },
        },
        { id: "deficit", label: "Deficit", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = pharmacySupplyLeadTimeDayCoverTool.execute;
export default pharmacySupplyLeadTimeDayCoverTool;
