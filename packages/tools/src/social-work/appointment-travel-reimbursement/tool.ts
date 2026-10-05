import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly distanceKm: number;
  readonly ratePerKm: number;
  readonly otherApprovedCost: number;
};
export type Output = { readonly reimbursement: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distanceKm: { type: "number", minimum: 0 },
    ratePerKm: { type: "number", minimum: 0 },
    otherApprovedCost: { type: "number", minimum: 0 },
  },
  required: ["distanceKm", "ratePerKm", "otherApprovedCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reimbursement: { type: "number" } },
  required: ["reimbursement"],
} as const;
/** Calculate a travel reimbursement from explicitly approved distance, rate and other costs, without determining eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distanceKm, ratePerKm, otherApprovedCost } = request;
  const compute = (): Output => {
    H.domain(
      distanceKm >= 0 && ratePerKm >= 0 && otherApprovedCost >= 0,
      "distanceKm",
    );
    return { reimbursement: distanceKm * ratePerKm + otherApprovedCost };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { distanceKm: 24, ratePerKm: 0.3, otherApprovedCost: 5 },
  output: { reimbursement: 12.2 },
} satisfies ToolExample<Input, Output>;
export const appointmentTravelReimbursementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "social-work/appointment-travel-reimbursement",
    title: "Appointment Travel Reimbursement Tool",
    description:
      "Calculate a travel reimbursement from explicitly approved distance, rate and other costs, without determining eligibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distanceKm: { type: "number", minimum: 0 },
        ratePerKm: { type: "number", minimum: 0 },
        otherApprovedCost: { type: "number", minimum: 0 },
      },
      required: ["distanceKm", "ratePerKm", "otherApprovedCost"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { reimbursement: { type: "number" } },
      required: ["reimbursement"],
    },
    ports: {
      inputs: [
        {
          id: "distanceKm",
          label: "Distance Km",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ratePerKm",
          label: "Rate Per Km",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "otherApprovedCost",
          label: "Other Approved Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "reimbursement",
          label: "Reimbursement",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = appointmentTravelReimbursementTool.execute;
export default appointmentTravelReimbursementTool;
