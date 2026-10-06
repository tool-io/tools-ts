import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rentalHours: number;
  readonly hourlyRate: number;
  readonly minimumCharge: number;
};
export type Output = {
  readonly usageCharge: number;
  readonly billedCharge: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rentalHours: { type: "number", minimum: 0 },
    hourlyRate: { type: "number", minimum: 0 },
    minimumCharge: { type: "number", minimum: 0 },
  },
  required: ["rentalHours", "hourlyRate", "minimumCharge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usageCharge: { type: "number" },
    billedCharge: { type: "number" },
  },
  required: ["usageCharge", "billedCharge"],
} as const;
/** Apply an explicitly supplied minimum charge to a machinery rental duration times hourly rate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rentalHours, hourlyRate, minimumCharge } = request;
  const compute = (): Output => {
    H.domain(rentalHours >= 0, "rentalHours");
    H.domain(hourlyRate >= 0, "hourlyRate");
    H.domain(minimumCharge >= 0, "minimumCharge");
    return {
      usageCharge: rentalHours * hourlyRate,
      billedCharge: Math.max(minimumCharge, rentalHours * hourlyRate),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rentalHours: 2, hourlyRate: 40, minimumCharge: 120 },
  output: { usageCharge: 80, billedCharge: 120 },
} satisfies ToolExample<Input, Output>;
export const machineryRentalMinimumChargeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "learn"],
      fields: ["agribusiness", "agriculture"],
      keywords: ["agribusiness", "agriculture"],
    },
    id: "agribusiness/machinery-rental-minimum-charge",
    title: "Machinery Rental Minimum Charge",
    description:
      "Apply an explicitly supplied minimum charge to a machinery rental duration times hourly rate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rentalHours: { type: "number", minimum: 0 },
        hourlyRate: { type: "number", minimum: 0 },
        minimumCharge: { type: "number", minimum: 0 },
      },
      required: ["rentalHours", "hourlyRate", "minimumCharge"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        usageCharge: { type: "number" },
        billedCharge: { type: "number" },
      },
      required: ["usageCharge", "billedCharge"],
    },
    ports: {
      inputs: [
        {
          id: "rentalHours",
          label: "Rental Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hourlyRate",
          label: "Hourly Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "minimumCharge",
          label: "Minimum Charge",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "usageCharge",
          label: "Usage Charge",
          valueType: { type: "number" },
        },
        {
          id: "billedCharge",
          label: "Billed Charge",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = machineryRentalMinimumChargeTool.execute;
export default machineryRentalMinimumChargeTool;
