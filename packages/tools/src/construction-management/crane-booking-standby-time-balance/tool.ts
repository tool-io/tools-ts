import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bookedHours: number;
  readonly activeHours: number;
  readonly standbyHours: number;
};
export type Output = { readonly unallocatedHours: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bookedHours: { type: "number", minimum: 0 },
    activeHours: { type: "number", minimum: 0 },
    standbyHours: { type: "number", minimum: 0 },
  },
  required: ["bookedHours", "activeHours", "standbyHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { unallocatedHours: { type: "number" } },
  required: ["unallocatedHours"],
} as const;
/** Reconcile explicit booked, active and standby crane hours without selecting chargeability or lift procedures. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bookedHours, activeHours, standbyHours } = request;
  const compute = (): Output => {
    H.domain(bookedHours >= 0, "bookedHours");
    H.domain(activeHours >= 0, "activeHours");
    H.domain(standbyHours >= 0, "standbyHours");
    return { unallocatedHours: bookedHours - activeHours - standbyHours };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bookedHours: 8, activeHours: 5, standbyHours: 2 },
  output: { unallocatedHours: 1 },
} satisfies ToolExample<Input, Output>;
export const craneBookingStandbyTimeBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "construction-management",
        "construction management",
        "engineering",
      ],
      keywords: ["construction management", "engineering"],
    },
    id: "construction-management/crane-booking-standby-time-balance",
    title: "Crane Booking Standby Time Balance",
    description:
      "Reconcile explicit booked, active and standby crane hours without selecting chargeability or lift procedures.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bookedHours: { type: "number", minimum: 0 },
        activeHours: { type: "number", minimum: 0 },
        standbyHours: { type: "number", minimum: 0 },
      },
      required: ["bookedHours", "activeHours", "standbyHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { unallocatedHours: { type: "number" } },
      required: ["unallocatedHours"],
    },
    ports: {
      inputs: [
        {
          id: "bookedHours",
          label: "Booked Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "activeHours",
          label: "Active Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "standbyHours",
          label: "Standby Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "unallocatedHours",
          label: "Unallocated Hours",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = craneBookingStandbyTimeBalanceTool.execute;
export default craneBookingStandbyTimeBalanceTool;
