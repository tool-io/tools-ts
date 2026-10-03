import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly spaces: number;
  readonly days: number;
  readonly ratePerSpaceDay: number;
  readonly discount: number;
};
export type Output = {
  readonly grossCharge: number;
  readonly netCharge: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spaces: { type: "integer", minimum: 0 },
    days: { type: "number", minimum: 0 },
    ratePerSpaceDay: { type: "number", minimum: 0 },
    discount: { type: "number", minimum: 0 },
  },
  required: ["spaces", "days", "ratePerSpaceDay", "discount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossCharge: { type: "number" },
    netCharge: { type: "number" },
  },
  required: ["grossCharge", "netCharge"],
} as const;
/** Calculate parking lease space day charge from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { spaces, days, ratePerSpaceDay, discount } = request;
  const compute = (): Output => {
    H.integer(spaces, 0);
    H.domain(
      days >= 0 &&
        ratePerSpaceDay >= 0 &&
        discount >= 0 &&
        discount <= spaces * days * ratePerSpaceDay,
    );
    return {
      grossCharge: spaces * days * ratePerSpaceDay,
      netCharge: spaces * days * ratePerSpaceDay - discount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { spaces: 3, days: 20, ratePerSpaceDay: 5, discount: 20 },
  output: { grossCharge: 300, netCharge: 280 },
} satisfies ToolExample<Input, Output>;
export const parkingLeaseSpaceDayChargeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "real-estate/parking-lease-space-day-charge",
    title: "Parking Lease Space Day Charge Tool",
    description:
      "Calculate parking lease space day charge from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spaces: { type: "integer", minimum: 0 },
        days: { type: "number", minimum: 0 },
        ratePerSpaceDay: { type: "number", minimum: 0 },
        discount: { type: "number", minimum: 0 },
      },
      required: ["spaces", "days", "ratePerSpaceDay", "discount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossCharge: { type: "number" },
        netCharge: { type: "number" },
      },
      required: ["grossCharge", "netCharge"],
    },
    ports: {
      inputs: [
        {
          id: "spaces",
          label: "Spaces",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "days",
          label: "Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ratePerSpaceDay",
          label: "Rate Per Space Day",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "discount",
          label: "Discount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossCharge",
          label: "Gross Charge",
          valueType: { type: "number" },
        },
        { id: "netCharge", label: "Net Charge", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = parkingLeaseSpaceDayChargeTool.execute;
export default parkingLeaseSpaceDayChargeTool;
