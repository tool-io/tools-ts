import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sharedHours: number;
  readonly ratePerHour: number;
  readonly fixedShareCharge: number;
};
export type Output = {
  readonly hourlyCharge: number;
  readonly totalCharge: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sharedHours: { type: "number", minimum: 0 },
    ratePerHour: { type: "number", minimum: 0 },
    fixedShareCharge: { type: "number", minimum: 0 },
  },
  required: ["sharedHours", "ratePerHour", "fixedShareCharge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hourlyCharge: { type: "number" },
    totalCharge: { type: "number" },
  },
  required: ["hourlyCharge", "totalCharge"],
} as const;
/** Extend a recorded shared-machinery use charge from an explicit hourly rate and fixed allocated charge. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sharedHours, ratePerHour, fixedShareCharge } = request;
  const compute = (): Output => {
    H.domain(
      sharedHours >= 0 && ratePerHour >= 0 && fixedShareCharge >= 0,
      "sharedHours",
    );
    return {
      hourlyCharge: sharedHours * ratePerHour,
      totalCharge: sharedHours * ratePerHour + fixedShareCharge,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sharedHours: 6, ratePerHour: 25, fixedShareCharge: 10 },
  output: { hourlyCharge: 150, totalCharge: 160 },
} satisfies ToolExample<Input, Output>;
export const machineryShareHourChargeTool = H.defineSchemaCalculation<
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
    id: "agribusiness/machinery-share-hour-charge",
    title: "Machinery Share Hour Charge",
    description:
      "Extend a recorded shared-machinery use charge from an explicit hourly rate and fixed allocated charge.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sharedHours: { type: "number", minimum: 0 },
        ratePerHour: { type: "number", minimum: 0 },
        fixedShareCharge: { type: "number", minimum: 0 },
      },
      required: ["sharedHours", "ratePerHour", "fixedShareCharge"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hourlyCharge: { type: "number" },
        totalCharge: { type: "number" },
      },
      required: ["hourlyCharge", "totalCharge"],
    },
    ports: {
      inputs: [
        {
          id: "sharedHours",
          label: "Shared Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ratePerHour",
          label: "Rate Per Hour",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixedShareCharge",
          label: "Fixed Share Charge",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "hourlyCharge",
          label: "Hourly Charge",
          valueType: { type: "number" },
        },
        {
          id: "totalCharge",
          label: "Total Charge",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = machineryShareHourChargeTool.execute;
export default machineryShareHourChargeTool;
